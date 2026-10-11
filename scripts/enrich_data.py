import os
import json
import re

# Load base data and Behance summary
with open('dist/data.json', 'r', encoding='utf-8') as f:
    dist_projects = json.load(f)

summary_path = r'D:\Ahmed\behance_yara_khamis-20261011T104643Z-1-001\behance_yara_khamis\all_projects_summary.json'
with open(summary_path, 'r', encoding='utf-8') as f:
    behance_summary = json.load(f)

behance_by_id = {str(p['id']): p for p in behance_summary}

print(f"Loaded {len(dist_projects)} dist projects and {len(behance_summary)} Behance projects.")
