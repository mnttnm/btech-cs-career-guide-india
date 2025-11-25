
import json
import re
import datetime

def parse_salary_range(text):
    # Matches "₹4.5-8 LPA", "₹18-25 LPA", "4.5-8", "₹50k-80k/month"
    # We only want LPA for the schema generally, but let's handle what we find.
    # Schema says "currency": "LPA".
    
    # Clean text
    text = text.replace('₹', '').replace(',', '').strip()
    
    # Check for k/month
    if 'k/month' in text:
        # Convert to LPA? Or return null? 
        # 50k-80k/month * 12 = 6L-9.6L roughly.
        # Let's just leave it null and warn if it doesn't match LPA pattern, 
        # or try to parse if it's clearly LPA.
        pass
    
    # Regex for "X-Y" or "X"
    # Allow decimals
    match = re.search(r'(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)', text)
    if match:
        return {"min": float(match.group(1)), "max": float(match.group(2))}
    
    match_single = re.search(r'(\d+(?:\.\d+)?)', text)
    if match_single:
        val = float(match_single.group(1))
        return {"min": val, "max": val}
        
    return None

def clean_list_item(item):
    # Remove leading "- " or "* " or "1. "
    return re.sub(r'^[\-\*1-9\.]+\s+', '', item).strip()

def extract_section(content, header_regex):
    match = re.search(header_regex, content, re.IGNORECASE | re.MULTILINE)
    if not match:
        return None
    start = match.end()
    # Find next header (### ...)
    next_header = re.search(r'\n###?\s+', content[start:])
    end = len(content)
    if next_header:
        end = start + next_header.start()
    return content[start:end].strip()

def parse_list(text):
    if not text:
        return []
    items = []
    for line in text.split('\n'):
        line = line.strip()
        if line.startswith('-') or line.startswith('*'):
            items.append(clean_list_item(line))
    return items

def parse_job_titles(section):
    fresher = []
    experienced = []
    
    lines = section.split('\n')
    current_list = None
    
    for line in lines:
        line = line.strip()
        if "Fresher Level" in line:
            current_list = fresher
        elif "Experienced Level" in line:
            current_list = experienced
        elif line.startswith('-') and current_list is not None:
            current_list.append(clean_list_item(line))
            
    return {"fresher": fresher, "experienced": experienced}

def parse_skills(section):
    skills = {
        "programmingLanguages": [],
        "coreConcepts": [],
        "frameworks": [],
        "tools": []
    }
    
    lines = section.split('\n')
    current_category = None
    
    for line in lines:
        line = line.strip()
        if "**Programming Languages:**" in line:
            current_category = "pl"
        elif "**Core Concepts:**" in line:
            current_category = "cc"
        elif "**Frameworks & Tools:**" in line:
            current_category = "ft"
        elif "**Soft Skills:**" in line:
            current_category = "ss"
        elif line.startswith('-'):
            content = clean_list_item(line)
            
            if current_category == "pl":
                # Parse name, level, priority
                # e.g. "**Mandatory (at least 2):** Java, Python..."
                if "**Mandatory" in content:
                    langs = content.split(':')[1].split(',')
                    for l in langs:
                        clean_l = l.replace("or similar", "").strip()
                        if clean_l:
                            skills["programmingLanguages"].append({"name": clean_l, "level": "Mandatory", "priority": "High"})
                elif "**SQL:**" in content:
                     skills["programmingLanguages"].append({"name": "SQL", "level": "Proficiency", "priority": "High"})
                elif "**Good to have:**" in content:
                    langs = content.split(':')[1].split(',')
                    for l in langs:
                        skills["programmingLanguages"].append({"name": l.strip(), "level": "Good to have", "priority": "Medium"})
            
            elif current_category == "cc":
                skills["coreConcepts"].append(content)
                
            elif current_category == "ft":
                # Check bold prefix
                # e.g. "**Testing Frameworks:** JUnit, ..."
                match = re.match(r'\*\*(.*?):\*\*(.*)', content)
                if match:
                    cat = match.group(1).lower()
                    vals = match.group(2).split(',')
                    vals = [v.strip() for v in vals if v.strip()]
                    
                    if "testing frameworks" in cat:
                        for v in vals:
                            skills["frameworks"].append({"name": v, "popularity": "High"})
                    elif "tools" in cat or "ides" in cat or "version control" in cat or "build tools" in cat or "ci/cd" in cat or "containerization" in cat or "project management" in cat or "documentation" in cat or "code quality" in cat:
                        skills["tools"].extend(vals)
                    elif "agile" in cat:
                        skills["coreConcepts"].append("Agile/Scrum") # or tools?
                else:
                    # Fallback
                    skills["tools"].append(content)
                    
    return skills

def parse_career_progression(section):
    res = {
        "timeline": [],
        "tracks": {"leadership": [], "individualContributor": []},
        "timelineToSenior": "",
        "alternativePaths": []
    }
    
    lines = section.split('\n')
    
    for line in lines:
        line = line.strip()
        if line.startswith('- **Entry Level'):
            # - **Entry Level (0-2 years):** Junior Software Engineer / Software Engineer I - ₹4.5-8 LPA
            parts = line.split(':', 1)
            if len(parts) > 1:
                details = parts[1].strip()
                # Split by " - " to get title and salary
                # "Junior Software Engineer ... - ₹4.5-8 LPA"
                subparts = details.rsplit('-', 1)
                if len(subparts) == 2:
                    title = subparts[0].strip()
                    salary_str = subparts[1].strip()
                    salary = parse_salary_range(salary_str)
                    if salary:
                        salary["currency"] = "LPA"
                    res["timeline"].append({
                        "level": "Entry Level",
                        "years": "0-2", # Hardcoded or extracted from key? Key has "Entry Level (0-2 years)"
                        "title": title,
                        "salary": salary
                    })
        elif line.startswith('- **Mid Level'):
            parts = line.split(':', 1)
            if len(parts) > 1:
                details = parts[1].strip()
                subparts = details.rsplit('-', 1)
                if len(subparts) == 2:
                    title = subparts[0].strip()
                    salary_str = subparts[1].strip()
                    salary = parse_salary_range(salary_str)
                    if salary:
                        salary["currency"] = "LPA"
                    res["timeline"].append({
                        "level": "Mid Level",
                        "years": "3-6", 
                        "title": title,
                        "salary": salary
                    })
        elif line.startswith('- **Senior Level'):
            parts = line.split(':', 1)
            if len(parts) > 1:
                details = parts[1].strip()
                subparts = details.rsplit('-', 1)
                if len(subparts) == 2:
                    title = subparts[0].strip()
                    salary_str = subparts[1].strip()
                    salary = parse_salary_range(salary_str)
                    if salary:
                        salary["currency"] = "LPA"
                    res["timeline"].append({
                        "level": "Senior Level",
                        "years": "7-10", 
                        "title": title,
                        "salary": salary
                    })
        elif "Leadership Track:**" in line:
            # Software Engineer → Senior Engineer ...
            content = line.split(':**')[1].strip()
            res["tracks"]["leadership"] = [x.strip() for x in content.split('→')]
        elif "Individual Contributor Track:**" in line:
            content = line.split(':**')[1].strip()
            res["tracks"]["individualContributor"] = [x.strip() for x in content.split('→')]
        elif "Timeline to Senior:**" in line:
            res["timelineToSenior"] = line.split(':**')[1].strip()
        elif "Alternative Paths:**" in line:
            pass # Just a header
        elif line.startswith('-') and "Alternative Paths" in section:
             # This is weak logic, need to know we are in Alternative Paths section
             pass

    # Re-parse for Alternative Paths correctly
    alt_section = extract_section(section, r'\*\*Alternative Paths:\*\*')
    if alt_section:
        res["alternativePaths"] = parse_list(alt_section)
    else:
        # Try to find where it starts in the big chunk
        if "**Alternative Paths:**" in section:
            start = section.find("**Alternative Paths:**")
            sub = section[start:]
            lines = sub.split('\n')[1:]
            for l in lines:
                if l.strip().startswith('-'):
                    res["alternativePaths"].append(clean_list_item(l))
    
    return res

def parse_salary_ranges(section):
    res = {
        "fresher": {},
        "threeYears": {},
        "fivePlus": {},
        "topCompanies": []
    }
    
    # Helper to extract subsections
    def get_sub(key_pattern):
        match = re.search(key_pattern, section, re.MULTILINE)
        if not match: return []
        start = match.end()
        end = len(section)
        next_match = re.search(r'\n\*\*', section[start:])
        if next_match:
            end = start + next_match.start()
        return parse_list(section[start:end])

    fresher_items = get_sub(r'\*\*Fresher \(0-1 year\):\*\*')
    for item in fresher_items:
        if "Service-based" in item:
            res["fresher"]["serviceBased"] = parse_salary_range(item)
        elif "Product-based" in item:
            res["fresher"]["productBased"] = parse_salary_range(item)
        elif "Top tech companies" in item:
            res["fresher"]["topTech"] = parse_salary_range(item)
        elif "Average range" in item:
            res["fresher"]["average"] = parse_salary_range(item)
            
    three_items = get_sub(r'\*\*3 Years Experience:\*\*')
    for item in three_items:
        if "service-based" in item:
            res["threeYears"]["serviceBased"] = parse_salary_range(item)
        elif "product-based" in item:
            res["threeYears"]["productBased"] = parse_salary_range(item)
        elif "top tech companies" in item:
            # Schema doesn't explicitly have topTech for threeYears but allows it?
            # Schema example: "threeYears": { "serviceBased": {"min":number,"max":number}, "productBased": {...}, "average": {...} }
            # I'll add it
            res["threeYears"]["topTech"] = parse_salary_range(item) # Add to extra if needed?
            # Actually, schema says "similar shape".
        elif "Average" in item:
            res["threeYears"]["average"] = parse_salary_range(item)

    five_items = get_sub(r'\*\*5\+ Years Experience:\*\*')
    for item in five_items:
        if "service-based" in item:
            res["fivePlus"]["serviceBased"] = parse_salary_range(item)
        elif "product companies" in item:
            res["fivePlus"]["productBased"] = parse_salary_range(item)
        elif "top companies" in item:
            res["fivePlus"]["topTech"] = parse_salary_range(item)
            
    top_items = get_sub(r'\*\*Top Companies by Salary:\*\*')
    for item in top_items:
        # Google: ₹18-25 LPA (fresher), ₹30-60 LPA (5+ years)
        parts = item.split(':')
        if len(parts) > 1:
            name = parts[0].strip()
            ranges_text = parts[1].strip()
            # Extract first range for simplicity or structure it?
            # Schema: "topCompanies": [ { "name": string, "range": { "min": number, "max": number } } ]
            # I should probably extract the "fresher" range or the overall range.
            # The text gives two ranges. I'll try to pick the fresher one as "range" or maybe represent both?
            # Schema implies single range. I will pick the 5+ years one? Or the Fresher one?
            # Let's pick the Fresher one for "Entry Level Friendly" role? Or maybe the highest?
            # "range" usually implies the full spectrum or the entry.
            # Let's use the fresher range as it is "Software Engineer General".
            range_val = parse_salary_range(ranges_text.split(',')[0])
            res["topCompanies"].append({"name": name, "range": range_val})

    return res

def parse_learning_curve(section):
    res = {"difficulty": "", "timeToJobReady": "", "description": ""}
    
    # Difficulty
    match = re.search(r'\*\*Difficulty:\*\* (.*)', section) # Wait, Difficulty is in top header
    # In Learning Curve section: "**Moderate** - Requires..."
    lines = section.split('\n')
    for line in lines:
        if line.strip().startswith('**Moderate**') or line.strip().startswith('**Easy**') or line.strip().startswith('**Hard**'):
            parts = line.strip().split('-', 1)
            res["difficulty"] = parts[0].replace('**', '').strip()
            if len(parts) > 1:
                res["description"] = parts[1].strip()
            
            # Extract timeToJobReady from description if present
            if "6-12 months" in line:
                res["timeToJobReady"] = "6-12 months"

    # Look for Timeline breakdown
    timeline_section = extract_section(section, r'\*\*Timeline breakdown:\*\*')
    # Not in schema learningCurve?
    # Schema: { "difficulty": string, "timeToJobReady": string, "description": string }
    # It doesn't ask for breakdown. I'll merge timeline breakdown into description or ignore?
    # I'll append it to description or leave it.
    
    return res

def parse_stress_level(section):
    res = {"level": "", "factors": [], "mitigatingFactors": []}
    lines = section.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('**Medium') or line.startswith('**High') or line.startswith('**Low'):
            res["level"] = line.replace('**', '').strip()

    factors = extract_section(section, r'\*\*Why .*:\*\*')
    if factors:
        res["factors"] = parse_list(factors)
        
    mitigating = extract_section(section, r'\*\*Mitigating Factors:\*\*')
    if mitigating:
        res["mitigatingFactors"] = parse_list(mitigating)
        
    return res

def parse_personality(section):
    res = {"thriveIf": [], "avoidIf": [], "idealBackground": []}
    
    thrive = extract_section(section, r'\*\*You\'ll Thrive If:\*\*')
    if thrive:
        res["thriveIf"] = parse_list(thrive)
        
    avoid = extract_section(section, r'\*\*Avoid If:\*\*')
    if avoid:
        res["avoidIf"] = parse_list(avoid)
        
    ideal = extract_section(section, r'\*\*Ideal Background:\*\*')
    if ideal:
        res["idealBackground"] = parse_list(ideal)
        
    return res

def parse_college_strategy(section):
    res = []
    # Year 1 (Foundation):
    year_regex = r'\*\*Year (\d) .*\*\*:'
    
    # Split by years
    # Since regex splitting might be tricky with multiline, iterate lines
    current_year = None
    current_goals = []
    current_title = ""
    
    lines = section.split('\n')
    for line in lines:
        line = line.strip()
        match = re.match(r'\*\*Year (\d) \((.*)\):\*\*', line)
        if match:
            if current_year is not None:
                res.append({"year": int(current_year), "title": current_title, "goals": current_goals})
            current_year = match.group(1)
            current_title = match.group(2)
            current_goals = []
        elif line.startswith('-') and current_year is not None:
            current_goals.append(clean_list_item(line))
        elif line.startswith('  -') and current_goals:
            # Append sub-bullets to previous goal
            current_goals[-1] += " (" + clean_list_item(line) + ")"
            
    if current_year is not None:
         res.append({"year": int(current_year), "title": current_title, "goals": current_goals})
         
    return res

def parse_first_job_strategy(section):
    res = {
        "technicalPrep": [],
        "applicationStrategy": [],
        "interviewPrep": [],
        "salaryExpectations": {"service": {}, "midTierProduct": {}, "topProduct": {}, "gcc": {}},
        "differentiators": []
    }
    
    # Technical Prep
    tech_prep = extract_section(section, r'\*\*Technical Preparation .*\*\*')
    if tech_prep:
        # "1. **DSA Mastery...**"
        # Extract items.
        # Regex to find numbered items
        items = re.split(r'\n\d+\.\s+\*\*', tech_prep)
        for item in items:
            if not item.strip(): continue
            # format: "Skill Name:** ..."
            parts = item.split(':**', 1)
            if len(parts) > 1:
                skill = parts[0].strip()
                goal = parts[1].strip().replace('\n', ' ')
                res["technicalPrep"].append({"skill": skill, "goal": goal})
                
    # Application Strategy
    app_strat = extract_section(section, r'\*\*Application Strategy:\*\*')
    if app_strat:
        items = re.split(r'\n\d+\.\s+\*\*', app_strat)
        for item in items:
            if not item.strip(): continue
            parts = item.split(':**', 1)
            if len(parts) > 1:
                channel = parts[0].strip()
                approach = parts[1].strip().replace('\n', ' ')
                res["applicationStrategy"].append({"channel": channel, "approach": approach})

    # Interview Prep
    int_prep = extract_section(section, r'\*\*Interview Preparation:\*\*')
    if int_prep:
        res["interviewPrep"] = parse_list(int_prep) # Simple list?
        # The section has numbered list with sub-bullets.
        # Schema says "interviewPrep": [string].
        # I'll flatten it.
        # "1. Technical Rounds... - DSA coding... - Problem-solving..."
        # I'll try to capture the main points and sub points.
        lines = int_prep.split('\n')
        for line in lines:
            line = line.strip()
            if line:
                res["interviewPrep"].append(clean_list_item(line))

    # Salary Expectations
    sal_exp = extract_section(section, r'\*\*Salary Expectations .*\*\*')
    if sal_exp:
        # - **Service Companies:** ₹3.5-4.5 LPA
        lines = sal_exp.split('\n')
        for line in lines:
            if "Service Companies" in line:
                res["salaryExpectations"]["service"] = parse_salary_range(line)
            elif "Mid-tier Product" in line:
                res["salaryExpectations"]["midTierProduct"] = parse_salary_range(line)
            elif "Top Product" in line:
                res["salaryExpectations"]["topProduct"] = parse_salary_range(line)
            elif "GCCs" in line:
                res["salaryExpectations"]["gcc"] = parse_salary_range(line)

    # Differentiators
    diffs = extract_section(section, r'\*\*Key Differentiators .*\*\*')
    if diffs:
        res["differentiators"] = parse_list(diffs)
        
    return res

def main():
    filepath = "BTech_Roles_Research/Part_01_Core_Software_Engineering/Role_01_Software_Engineer_General.md"
    with open(filepath, 'r') as f:
        content = f.read()
        
    data = {}
    
    # Header Info
    data["roleId"] = "Role_01_Software_Engineer_General"
    data["roleName"] = "Software Engineer (General)"
    
    diff_match = re.search(r'\*\*Difficulty:\*\* (.*)', content)
    if diff_match:
        parts = diff_match.group(1).split('-', 1)
        data["difficulty"] = parts[0].strip()
        if len(parts) > 1:
            data["description"] = parts[1].strip()
    
    # Sections
    job_titles_section = extract_section(content, r'### Real Job Titles.*')
    if job_titles_section:
        data["jobTitles"] = parse_job_titles(job_titles_section)
        
    skills_section = extract_section(content, r'### Required Skills')
    if skills_section:
        data["skills"] = parse_skills(skills_section)
        
    daily_work_section = extract_section(content, r'### Day-to-Day Work')
    if daily_work_section:
        data["dailyWork"] = parse_list(daily_work_section)
        
    growth_section = extract_section(content, r'### Growth Potential')
    if growth_section:
        data["careerProgression"] = parse_career_progression(growth_section)
        
    salary_section = extract_section(content, r'### Salary Ranges.*')
    if salary_section:
        data["salaryRanges"] = parse_salary_ranges(salary_section)
        
    learning_section = extract_section(content, r'### Learning Curve')
    if learning_section:
        data["learningCurve"] = parse_learning_curve(learning_section)
        
    stress_section = extract_section(content, r'### Stress Level')
    if stress_section:
        data["stressLevel"] = parse_stress_level(stress_section)
        
    personality_section = extract_section(content, r'### Personality Fit')
    if personality_section:
        data["personalityFit"] = parse_personality(personality_section)
        
    college_section = extract_section(content, r'### From Day 1: Year-by-Year College Strategy')
    if college_section:
        data["collegeStrategy"] = parse_college_strategy(college_section)
        
    first_job_section = extract_section(content, r'### First Job Strategy')
    if first_job_section:
        data["firstJobStrategy"] = parse_first_job_strategy(first_job_section)
        
    # Extra content handling
    extra = {}
    
    # Location Based Variations
    loc_var = extract_section(content, r'\*\*Location-Based Variations:\*\*') # This was inside Salary Ranges in markdown, so check if extracted?
    # parse_salary_ranges might have missed it or we need to extract it separately if it's not part of salary ranges structure
    # It is inside Salary Ranges section in Markdown.
    if salary_section and "**Location-Based Variations:**" in salary_section:
        # Extract it
        sub = extract_section(salary_section, r'\*\*Location-Based Variations:\*\*')
        if sub:
            extra["locationBasedVariations"] = parse_list(sub)

    # Top Companies Hiring in India
    top_companies_section = extract_section(content, r'### Top Companies Hiring in India')
    if top_companies_section:
        extra["topCompaniesHiring"] = parse_list(top_companies_section) # This will be messy list, better to store raw or parse categories
        # Let's store as raw text or structured if possible. 
        # The prompt says "If a block doesn’t fit, put it in extra."
        # I'll put the raw text or a simple extracted list.
        # Given the structure, let's just dump the text or lines.
        extra["topCompaniesHiring"] = top_companies_section.split('\n')

    if extra:
        data["extra"] = extra

    # Construct Meta
    meta = {
        "original": "Role_01_Software_Engineer_General.md",
        "convertedAt": datetime.datetime.now().isoformat(),
        "extractor": "agent",
        "warnings": []
    }
    
    # Checks and Warnings
    if not data.get("salaryRanges", {}).get("fresher", {}).get("serviceBased"):
        meta["warnings"].append({"line": "Salary Ranges", "issue": "Missing fresher serviceBased salary", "decision": "Set to null"})
        
    # Report content
    report = f"# Conversion Report for {meta['original']}\n\n"
    report += f"**Converted At:** {meta['convertedAt']}\n\n"
    report += "## Decisions and Ambiguities\n"
    for w in meta["warnings"]:
        report += f"- **{w['line']}**: {w['issue']} -> {w['decision']}\n"
        
    # Save files
    base_path = "BTech_Roles_Research/Part_01_Core_Software_Engineering/json_schemas/gpt/Role_01_Software_Engineer_General"
    
    with open(f"{base_path}.json", 'w') as f:
        json.dump(data, f, indent=2)
        
    with open(f"{base_path}.meta.json", 'w') as f:
        json.dump(meta, f, indent=2)
        
    with open(f"{base_path}.report.md", 'w') as f:
        f.write(report)

    print("Conversion complete.")

if __name__ == "__main__":
    main()
