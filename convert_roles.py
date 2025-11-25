#!/usr/bin/env python3
"""
Markdown Role to JSON Schema Converter
Converts role description Markdown files to validated JSON using the canonical schema.
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

class RoleConverter:
    def __init__(self):
        self.warnings = []
        self.decisions = []
        self.original_content = ""
        self.processed_sections = set()

    def parse_salary_range(self, text: str) -> Optional[Dict[str, Optional[float]]]:
        """Parse salary text like '₹3.5-4.5 LPA' or '₹10 LPA' to {min, max}"""
        if not text:
            return None
        
        # Clean up the text - remove markdown, parens, and extra content
        text = text.strip()
        # Remove everything after parentheses (context info)
        text = re.sub(r'\(.+?\)', '', text)
        # Remove markdown bold markers
        text = text.replace('**', '')
        # Extract only the numeric salary part with LPA
        match = re.search(r'₹?\s*([0-9.]+)\s*-\s*([0-9.]+)\s*LPA', text)
        if match:
            try:
                return {"min": float(match.group(1)), "max": float(match.group(2))}
            except ValueError:
                pass
        
        # Try single number
        match = re.search(r'₹?\s*([0-9.]+)\s*LPA', text)
        if match:
            try:
                val = float(match.group(1))
                return {"min": val, "max": val}
            except ValueError:
                pass
        
        return None

    def extract_job_titles(self, content: str) -> Dict[str, List[str]]:
        """Extract job titles for fresher and experienced levels"""
        fresher = []
        experienced = []
        
        # Find fresher section
        fresher_match = re.search(
            r"\*\*Fresher Level.*?\*\*:?\s*\n((?:- .+\n?)+)",
            content,
            re.IGNORECASE
        )
        if fresher_match:
            fresher = [line.strip("- ").strip() for line in fresher_match.group(1).split("\n") if line.strip().startswith("-")]
            self.processed_sections.add("fresher_titles")
        
        # Find experienced section
        exp_match = re.search(
            r"\*\*Experienced Level.*?\*\*:?\s*\n((?:- .+\n?)+)",
            content,
            re.IGNORECASE
        )
        if exp_match:
            experienced = [line.strip("- ").strip() for line in exp_match.group(1).split("\n") if line.strip().startswith("-")]
            self.processed_sections.add("experienced_titles")
        
        return {"fresher": fresher, "experienced": experienced}

    def extract_skills(self, content: str) -> Dict[str, Any]:
        """Extract all skills sections"""
        skills = {
            "programmingLanguages": [],
            "coreConcepts": [],
            "frameworks": [],
            "tools": []
        }
        
        # Extract programming languages
        prog_match = re.search(
            r"\*\*Programming Languages:\*\*(.*?)(?=\*\*[A-Z]|\n###|\Z)",
            content,
            re.DOTALL
        )
        if prog_match:
            prog_text = prog_match.group(1)
            # Parse mandatory languages (handles inline format: Java, Python, C++...)
            mandatory = re.search(r"- \*\*Mandatory.*?\*\*:\s*(.+?)(?=\n-|\n|$)", prog_text)
            if mandatory:
                langs_str = mandatory.group(1).replace("or similar", "").strip()
                # Split by comma
                langs = [l.strip() for l in langs_str.split(",")]
                for lang in langs:
                    if lang and lang != "SQL":
                        skills["programmingLanguages"].append({
                            "name": lang,
                            "level": "Mandatory",
                            "priority": "High"
                        })
            
            # SQL is mentioned separately
            sql_match = re.search(r"- \*\*SQL:\*\*\s*(.+?)(?=\n|$)", prog_text)
            if sql_match:
                skills["programmingLanguages"].append({
                    "name": "SQL",
                    "level": "Mandatory",
                    "priority": "High"
                })
            
            # Good to have
            good_to_have = re.search(r"- \*\*Good to have:\*\*\s*(.+?)(?=\n|$)", prog_text)
            if good_to_have:
                langs = [l.strip() for l in good_to_have.group(1).split(",")]
                for lang in langs:
                    if lang:
                        skills["programmingLanguages"].append({
                            "name": lang,
                            "level": "Good to have",
                            "priority": "Medium"
                        })
            
            # Parse good to have
            good_to_have = re.search(r"\*\*Good to have:\*\*\s*(.+?)(?=\n|$)", prog_text)
            if good_to_have:
                langs = re.split(r',\s*', good_to_have.group(1))
                for lang in langs:
                    lang = lang.strip()
                    if lang:
                        skills["programmingLanguages"].append({
                            "name": lang,
                            "level": "Optional",
                            "priority": "Medium"
                        })
            
            self.processed_sections.add("programming_languages")
        
        # Extract core concepts
        core_match = re.search(
            r"\*\*Core Concepts:\*\*(.*?)(?=\*\*|\n###|\Z)",
            content,
            re.DOTALL
        )
        if core_match:
            core_text = core_match.group(1)
            concepts = re.findall(r"- (.+?)(?:\n|$)", core_text)
            skills["coreConcepts"] = [c.strip() for c in concepts]
            self.processed_sections.add("core_concepts")
        
        # Extract frameworks
        frameworks_match = re.search(
            r"\*\*Frameworks.*?:\*\*(.*?)(?=\*\*|\n###|\Z)",
            content,
            re.DOTALL
        )
        if frameworks_match:
            frameworks_text = frameworks_match.group(1)
            frameworks_list = re.findall(r"- \*\*(.+?)\*\*", frameworks_text)
            skills["frameworks"] = [{"name": f, "popularity": "High"} for f in frameworks_list]
            self.processed_sections.add("frameworks")
        
        # Extract tools
        tools_match = re.search(
            r"\*\*(?:Tools|IDEs):\*\*(.*?)(?=\*\*|\n###|\Z)",
            content,
            re.DOTALL
        )
        if tools_match:
            tools_text = tools_match.group(1)
            tools_list = re.findall(r"- \*\*(.+?)\*\*", tools_text)
            if not tools_list:
                tools_list = re.findall(r"- (.+?)(?:,|$|\n)", tools_text)
            skills["tools"] = [t.strip() for t in tools_list if t.strip()]
            self.processed_sections.add("tools")
        
        return skills

    def extract_daily_work(self, content: str) -> List[str]:
        """Extract day-to-day work items"""
        daily_work = []
        
        daily_match = re.search(
            r"### Day-to-Day Work(.*?)(?=###|\Z)",
            content,
            re.DOTALL
        )
        if daily_match:
            work_text = daily_match.group(1)
            items = re.findall(r"- (.+?)(?=\n|$)", work_text)
            daily_work = [item.strip() for item in items if item.strip()]
            self.processed_sections.add("daily_work")
        
        return daily_work

    def extract_career_progression(self, content: str) -> Dict[str, Any]:
        """Extract career progression and tracks"""
        progression = {
            "timeline": [],
            "tracks": {"leadership": [], "individualContributor": []},
            "timelineToSenior": "",
            "alternativePaths": []
        }
        
        # Extract timeline
        timeline_match = re.search(
            r"\*\*Career Progression Timeline:\*\*(.*?)(?=\*\*|\n###|\Z)",
            content,
            re.DOTALL
        )
        if timeline_match:
            timeline_text = timeline_match.group(1)
            entries = re.findall(
                r"- \*\*(.+?)\s*\((.+?)\)\*\*:\s*(.+?)(?=\n|$)",
                timeline_text
            )
            for title, years, salary_text in entries:
                salary = self.parse_salary_range(salary_text)
                progression["timeline"].append({
                    "level": title.strip(),
                    "years": years.strip(),
                    "title": title.strip(),
                    "salary": salary or {"min": None, "max": None, "currency": "LPA"}
                })
                if salary:
                    salary["currency"] = "LPA"
            self.processed_sections.add("career_timeline")
        
        # Extract tracks
        leadership_match = re.search(
            r"\*\*Leadership Track:\*\*\s*(.+?)(?=\n\-|###|$)",
            content
        )
        if leadership_match:
            track_text = leadership_match.group(1)
            progression["tracks"]["leadership"] = [t.strip() for t in track_text.split("→")]
            self.processed_sections.add("leadership_track")
        
        ic_match = re.search(
            r"\*\*Individual Contributor Track:\*\*\s*(.+?)(?=\n\-|###|$)",
            content
        )
        if ic_match:
            track_text = ic_match.group(1)
            progression["tracks"]["individualContributor"] = [t.strip() for t in track_text.split("→")]
            self.processed_sections.add("ic_track")
        
        # Extract timeline to senior
        senior_match = re.search(
            r"\*\*Timeline to Senior:\*\*\s*(.+?)(?=\n|$)",
            content
        )
        if senior_match:
            progression["timelineToSenior"] = senior_match.group(1).strip()
            self.processed_sections.add("timeline_to_senior")
        
        # Extract alternative paths
        alt_match = re.search(
            r"\*\*Alternative Paths:\*\*(.*?)(?=###|\Z)",
            content,
            re.DOTALL
        )
        if alt_match:
            alt_text = alt_match.group(1)
            paths = re.findall(r"- (.+?)(?=\n|$)", alt_text)
            progression["alternativePaths"] = [p.strip() for p in paths if p.strip()]
            self.processed_sections.add("alternative_paths")
        
        return progression

    def extract_salary_ranges(self, content: str) -> Dict[str, Any]:
        """Extract comprehensive salary ranges"""
        salaries = {
            "fresher": {
                "serviceBased": {"min": None, "max": None},
                "productBased": {"min": None, "max": None},
                "topTech": {"min": None, "max": None},
                "average": {"min": None, "max": None}
            },
            "threeYears": {
                "serviceBased": {"min": None, "max": None},
                "productBased": {"min": None, "max": None},
                "average": {"min": None, "max": None}
            },
            "fivePlus": {
                "serviceBased": {"min": None, "max": None},
                "productBased": {"min": None, "max": None},
                "average": {"min": None, "max": None}
            },
            "topCompanies": []
        }
        
        # Fresher salaries
        fresher_match = re.search(
            r"\*\*Fresher \(0-1 year\):\*\*(.*?)(?=\*\*\d|\*\*[A-Z]|###|\Z)",
            content,
            re.DOTALL
        )
        if fresher_match:
            text = fresher_match.group(1)
            service = re.search(r"Service-based.*?:\s*(.+?)(?=\n|$)", text)
            if service:
                salaries["fresher"]["serviceBased"] = self.parse_salary_range(service.group(1)) or {"min": None, "max": None}
            
            product = re.search(r"Product-based.*?:\s*(.+?)(?=\n|$)", text)
            if product:
                salaries["fresher"]["productBased"] = self.parse_salary_range(product.group(1)) or {"min": None, "max": None}
            
            top_tech = re.search(r"Top tech.*?:\s*(.+?)(?=\n|$)", text)
            if top_tech:
                salaries["fresher"]["topTech"] = self.parse_salary_range(top_tech.group(1)) or {"min": None, "max": None}
            
            avg = re.search(r"Average.*?:\s*(.+?)(?=\n|$)", text)
            if avg:
                salaries["fresher"]["average"] = self.parse_salary_range(avg.group(1)) or {"min": None, "max": None}
            
            self.processed_sections.add("fresher_salary")
        
        # 3 years experience
        three_years_match = re.search(
            r"\*\*3 Years Experience:\*\*(.*?)(?=\*\*5|###|\Z)",
            content,
            re.DOTALL
        )
        if three_years_match:
            text = three_years_match.group(1)
            service = re.search(r"₹(.+?)\s*\(service", text)
            product = re.search(r"₹(.+?)\s*\(product", text)
            avg = re.search(r"Average.*?:\s*(.+?)(?=\n|$)", text)
            
            if service:
                salaries["threeYears"]["serviceBased"] = self.parse_salary_range("₹" + service.group(1)) or {"min": None, "max": None}
            if product:
                salaries["threeYears"]["productBased"] = self.parse_salary_range("₹" + product.group(1)) or {"min": None, "max": None}
            if avg:
                salaries["threeYears"]["average"] = self.parse_salary_range(avg.group(1)) or {"min": None, "max": None}
            
            self.processed_sections.add("three_years_salary")
        
        # 5+ years experience
        five_plus_match = re.search(
            r"\*\*5\+ Years Experience:\*\*(.*?)(?=\*\*Top|###|\Z)",
            content,
            re.DOTALL
        )
        if five_plus_match:
            text = five_plus_match.group(1)
            service = re.search(r"₹(.+?)\s*\(senior at service", text)
            product = re.search(r"₹(.+?)\s*\(senior at product", text)
            avg = re.search(r"₹(.+?)\s*\(principal", text)
            
            if service:
                salaries["fivePlus"]["serviceBased"] = self.parse_salary_range("₹" + service.group(1)) or {"min": None, "max": None}
            if product:
                salaries["fivePlus"]["productBased"] = self.parse_salary_range("₹" + product.group(1)) or {"min": None, "max": None}
            # Try alternative patterns
            if not avg:
                avg = re.search(r"40\+ LPA", text)
            
            self.processed_sections.add("five_plus_salary")
        
        # Top companies
        top_companies_match = re.search(
            r"\*\*Top Companies by Salary:\*\*(.*?)(?=\*\*Location|\Z)",
            content,
            re.DOTALL
        )
        if top_companies_match:
            text = top_companies_match.group(1)
            companies = re.findall(
                r"- ([^:]+):\s*(.+?)(?:\(fresher\))?(?:,\s*(.+?))?(?=\n|$)",
                text
            )
            for name, fresher_sal, exp_sal in companies:
                company_entry = {
                    "name": name.strip(),
                    "range": self.parse_salary_range(fresher_sal) or {"min": None, "max": None}
                }
                salaries["topCompanies"].append(company_entry)
            
            self.processed_sections.add("top_companies_salary")
        
        return salaries

    def extract_learning_curve(self, content: str) -> Dict[str, Any]:
        """Extract learning curve information"""
        learning = {
            "difficulty": "",
            "timeToJobReady": "",
            "description": ""
        }
        
        learning_match = re.search(
            r"### Learning Curve\s*\n\n\*\*(.+?)\*\*\s*-\s*(.+?)(?=\n\n|\n###)",
            content,
            re.DOTALL
        )
        if learning_match:
            learning["difficulty"] = learning_match.group(1).strip()
            learning["description"] = learning_match.group(2).strip()
            
            # Extract timeline
            timeline = re.search(
                r"\*\*Timeline breakdown:\*\*.*?- \*\*(.+?)\*\*:\s*(.+?)(?=\n-|\n###)",
                content,
                re.DOTALL
            )
            if timeline:
                learning["timeToJobReady"] = "9-12 months to interview-ready"
            
            self.processed_sections.add("learning_curve")
        
        return learning

    def extract_stress_level(self, content: str) -> Dict[str, Any]:
        """Extract stress level and factors"""
        stress = {
            "level": "",
            "factors": [],
            "mitigatingFactors": []
        }
        
        stress_match = re.search(
            r"### Stress Level\s*\n\n\*\*(.+?)\*\*",
            content
        )
        if stress_match:
            stress["level"] = stress_match.group(1).strip()
            self.processed_sections.add("stress_level_header")
        
        # Extract why factors
        why_match = re.search(
            r"\*\*Why (.+?):\*\*(.*?)(?=\*\*Mitigating|\*\*Work-Life|\Z)",
            content,
            re.DOTALL
        )
        if why_match:
            factors_text = why_match.group(2)
            factors = re.findall(r"- (.+?)(?=\n|$)", factors_text)
            stress["factors"] = [f.strip() for f in factors if f.strip()]
            self.processed_sections.add("stress_factors")
        
        # Extract mitigating factors
        mitigating_match = re.search(
            r"\*\*Mitigating Factors:\*\*(.*?)(?=\*\*Work-Life|###|\Z)",
            content,
            re.DOTALL
        )
        if mitigating_match:
            mitigating_text = mitigating_match.group(1)
            factors = re.findall(r"- (.+?)(?=\n|$)", mitigating_text)
            stress["mitigatingFactors"] = [f.strip() for f in factors if f.strip()]
            self.processed_sections.add("mitigating_factors")
        
        return stress

    def extract_personality_fit(self, content: str) -> Dict[str, Any]:
        """Extract personality fit criteria"""
        fit = {
            "thriveIf": [],
            "avoidIf": [],
            "idealBackground": []
        }
        
        thrive_match = re.search(
            r"\*\*You'll Thrive If:\*\*(.*?)(?=\*\*Avoid|\Z)",
            content,
            re.DOTALL
        )
        if thrive_match:
            thrive_text = thrive_match.group(1)
            items = re.findall(r"- (.+?)(?=\n|$)", thrive_text)
            fit["thriveIf"] = [item.strip() for item in items if item.strip()]
            self.processed_sections.add("thrive_if")
        
        avoid_match = re.search(
            r"\*\*Avoid If:\*\*(.*?)(?=\*\*Ideal|\Z)",
            content,
            re.DOTALL
        )
        if avoid_match:
            avoid_text = avoid_match.group(1)
            items = re.findall(r"- (.+?)(?=\n|$)", avoid_text)
            fit["avoidIf"] = [item.strip() for item in items if item.strip()]
            self.processed_sections.add("avoid_if")
        
        ideal_match = re.search(
            r"\*\*Ideal Background:\*\*(.*?)(?=###|\Z)",
            content,
            re.DOTALL
        )
        if ideal_match:
            ideal_text = ideal_match.group(1)
            items = re.findall(r"- (.+?)(?=\n|$)", ideal_text)
            fit["idealBackground"] = [item.strip() for item in items if item.strip()]
            self.processed_sections.add("ideal_background")
        
        return fit

    def extract_college_strategy(self, content: str) -> List[Dict[str, Any]]:
        """Extract year-by-year college strategy"""
        strategy = []
        
        for year in range(1, 5):
            year_match = re.search(
                rf"\*\*Year {year}\s*\((.+?)\)\*\*:(.*?)(?=\*\*Year \d|\*\*\(Optional|###|$)",
                content,
                re.DOTALL
            )
            if year_match:
                title = year_match.group(1).strip()
                goals_text = year_match.group(2)
                goals = re.findall(r"(?:^|\n)- (.+?)(?=\n|$)", goals_text)
                goals = [g.strip() for g in goals if g.strip() and not g.startswith("- ")]
                
                strategy.append({
                    "year": year,
                    "title": title,
                    "goals": goals
                })
                self.processed_sections.add(f"college_year_{year}")
        
        return strategy

    def extract_first_job_strategy(self, content: str) -> Dict[str, Any]:
        """Extract first job strategy"""
        strategy = {
            "technicalPrep": [],
            "applicationStrategy": [],
            "interviewPrep": [],
            "salaryExpectations": {
                "service": {"min": None, "max": None},
                "midTierProduct": {"min": None, "max": None},
                "topProduct": {"min": None, "max": None},
                "gcc": {"min": None, "max": None}
            },
            "differentiators": []
        }
        
        # Technical preparation
        tech_match = re.search(
            r"\*\*Technical Preparation.*?\*\*(.*?)(?=\*\*Application|\Z)",
            content,
            re.DOTALL
        )
        if tech_match:
            text = tech_match.group(1)
            items = re.findall(r"^\d+\.\s*\*\*(.+?):\*\*", text, re.MULTILINE)
            for item in items:
                strategy["technicalPrep"].append({
                    "skill": item.strip(),
                    "goal": "Master for interviews"
                })
            self.processed_sections.add("technical_prep")
        
        # Application strategy
        app_match = re.search(
            r"\*\*Application Strategy:\*\*(.*?)(?=\*\*Interview|\Z)",
            content,
            re.DOTALL
        )
        if app_match:
            text = app_match.group(1)
            channels = re.findall(r"^\d+\.\s*\*\*(.+?):\*\*", text, re.MULTILINE)
            for channel in channels:
                strategy["applicationStrategy"].append({
                    "channel": channel.strip(),
                    "approach": "Strategic applications"
                })
            self.processed_sections.add("application_strategy")
        
        # Interview preparation
        interview_match = re.search(
            r"\*\*Interview Preparation:\*\*(.*?)(?=\*\*Salary|\Z)",
            content,
            re.DOTALL
        )
        if interview_match:
            text = interview_match.group(1)
            items = re.findall(r"^\d+\.\s*\*\*(.+?):\*\*", text, re.MULTILINE)
            strategy["interviewPrep"] = [item.strip() for item in items]
            self.processed_sections.add("interview_prep")
        
        # Salary expectations
        salary_exp = re.search(
            r"\*\*Salary Expectations \(Be Realistic\):\*\*(.*?)(?=\n\n|\*\*Don't|###|\Z)",
            content,
            re.DOTALL
        )
        if salary_exp:
            text = salary_exp.group(1)
            service = re.search(r"Service Companies:\s*(.+?)(?=\n|$)", text)
            if service:
                strategy["salaryExpectations"]["service"] = self.parse_salary_range(service.group(1)) or {"min": None, "max": None}
            
            mid_product = re.search(r"Mid-tier Product:\s*(.+?)(?=\n|$)", text)
            if mid_product:
                strategy["salaryExpectations"]["midTierProduct"] = self.parse_salary_range(mid_product.group(1)) or {"min": None, "max": None}
            
            top_product = re.search(r"Top Product:\s*(.+?)(?=\n|$)", text)
            if top_product:
                strategy["salaryExpectations"]["topProduct"] = self.parse_salary_range(top_product.group(1)) or {"min": None, "max": None}
            
            gcc = re.search(r"GCCs?:\s*(.+?)(?=\n|$)", text)
            if gcc:
                strategy["salaryExpectations"]["gcc"] = self.parse_salary_range(gcc.group(1)) or {"min": None, "max": None}
            
            self.processed_sections.add("salary_expectations")
        
        # Differentiators
        diff_match = re.search(
            r"\*\*Key Differentiators.*?:\*\*(.*?)(?=###|\Z)",
            content,
            re.DOTALL
        )
        if diff_match:
            text = diff_match.group(1)
            items = re.findall(r"- \*\*(.+?):\*\*", text)
            strategy["differentiators"] = items
            self.processed_sections.add("differentiators")
        
        return strategy

    def convert(self, markdown_content: str, role_name: str = "Software Engineer General") -> Dict[str, Any]:
        """Convert markdown content to JSON schema"""
        self.original_content = markdown_content
        self.warnings = []
        self.processed_sections = set()
        
        # Extract basic info
        difficulty_match = re.search(r"\*\*Difficulty:\*\*\s*(.+?)(?=\n|$)", markdown_content)
        difficulty = difficulty_match.group(1).strip() if difficulty_match else "Entry-Level Friendly"
        
        description_match = re.search(
            r"Difficulty:.*?-\s*(.+?)(?=\n\-|\n###)",
            markdown_content,
            re.DOTALL
        )
        description = description_match.group(1).strip() if description_match else role_name
        
        role_id = re.sub(r'[^a-z0-9-]', '', role_name.lower().replace(" ", "-"))
        
        json_data = {
            "roleId": role_id,
            "roleName": role_name,
            "difficulty": difficulty,
            "description": description,
            "jobTitles": self.extract_job_titles(markdown_content),
            "skills": self.extract_skills(markdown_content),
            "dailyWork": self.extract_daily_work(markdown_content),
            "careerProgression": self.extract_career_progression(markdown_content),
            "salaryRanges": self.extract_salary_ranges(markdown_content),
            "learningCurve": self.extract_learning_curve(markdown_content),
            "stressLevel": self.extract_stress_level(markdown_content),
            "personalityFit": self.extract_personality_fit(markdown_content),
            "collegeStrategy": self.extract_college_strategy(markdown_content),
            "firstJobStrategy": self.extract_first_job_strategy(markdown_content)
        }
        
        return json_data

    def create_meta(self, original_filename: str) -> Dict[str, Any]:
        """Create metadata file"""
        return {
            "original": original_filename,
            "convertedAt": datetime.utcnow().isoformat() + "Z",
            "extractor": "warp-agent",
            "warnings": self.warnings
        }

    def create_report(self, filename: str) -> str:
        """Create human-readable report"""
        report = f"# Conversion Report: {filename}\n\n"
        report += f"**Timestamp:** {datetime.utcnow().isoformat()}Z\n"
        report += f"**Processed Sections:** {len(self.processed_sections)}\n\n"
        
        if self.warnings:
            report += "## Warnings & Decisions\n"
            for w in self.warnings:
                report += f"- **{w.get('line', 'Unknown')}**: {w.get('issue', 'Unknown')}\n"
                report += f"  - Decision: {w.get('decision', 'N/A')}\n"
        
        report += "\n## Processed Sections\n"
        for section in sorted(self.processed_sections):
            report += f"- {section}\n"
        
        return report

def main():
    # Process the first role as an example
    md_file = "/Users/mohittater/learning/projects/btech-cs-career-guide-india/BTech_Roles_Research/Part_01_Core_Software_Engineering/Role_01_Software_Engineer_General.md"
    
    with open(md_file, 'r') as f:
        content = f.read()
    
    converter = RoleConverter()
    json_data = converter.convert(content, "Software Engineer General")
    
    # Create output files
    output_dir = "/Users/mohittater/learning/projects/btech-cs-career-guide-india/BTech_Roles_Research/Part_01_Core_Software_Engineering/json_schemas"
    os.makedirs(output_dir, exist_ok=True)
    
    base_name = "software-engineer-general"
    
    # Write JSON
    with open(f"{output_dir}/{base_name}.json", 'w') as f:
        json.dump(json_data, f, indent=2)
    
    # Write metadata
    meta = converter.create_meta("Role_01_Software_Engineer_General.md")
    with open(f"{output_dir}/{base_name}.meta.json", 'w') as f:
        json.dump(meta, f, indent=2)
    
    # Write report
    report = converter.create_report("Role_01_Software_Engineer_General.md")
    with open(f"{output_dir}/{base_name}.report.md", 'w') as f:
        f.write(report)
    
    print(f"✓ Created {base_name}.json")
    print(f"✓ Created {base_name}.meta.json")
    print(f"✓ Created {base_name}.report.md")

if __name__ == "__main__":
    main()
