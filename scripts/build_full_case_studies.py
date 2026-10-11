import os
import json
import re
import ftfy

# Load base data and Behance summary
with open('dist/data.json', 'r', encoding='utf-8') as f:
    dist_projects = json.load(f)

summary_path = r'D:\Ahmed\behance_yara_khamis-20261011T104643Z-1-001\behance_yara_khamis\all_projects_summary.json'
with open(summary_path, 'r', encoding='utf-8') as f:
    behance_summary = json.load(f)

behance_by_id = {str(p['id']): p for p in behance_summary}

def clean_text(text):
    if not text:
        return ""
    text = ftfy.fix_text(text)
    # Fix common mojibake remnants
    text = text.replace('تغلي٠', 'تغليف').replace('Ø', '').replace('Ù', '').replace('Â', '').replace('â€”', '—').replace('â€™', '’').replace('â€œ', '“').replace('â€', '”')
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def determine_client(title, tags, texts):
    combined = (title + " " + " ".join(tags) + " " + " ".join(texts)).lower()
    if 'dubai police' in combined:
        return 'Dubai Police'
    if 'dubai municipality' in combined:
        return 'Dubai Municipality'
    if 'dafza' in combined:
        return 'DAFZA (Dubai Airport Freezone)'
    if 'liwa' in combined:
        return 'Liwa Ajman Dates & Honey Festival'
    if 'bonatella' in combined:
        return 'Bonatella Confectionery'
    if 'mixly' in combined:
        return 'Mixly Foods'
    if 'al-amir' in combined or 'zain' in combined:
        return 'Al-Amir & Zain Dates'
    if 'alarya' in combined:
        return 'ALARYA Cosmetics'
    if 'velora' in combined:
        return 'Velora Fragrances'
    if 'tete' in combined:
        return 'Tête Bakery & Confectionery'
    if 'foodico' in combined:
        return 'FOODICO'
    if 'consul' in combined:
        return 'Consul Canned Foods'
    if 'dazzel' in combined or 'dazzle' in combined:
        return 'Dazzle Chocolate'
    if 'sano' in combined:
        return 'Sano Biscuits'
    if 'hana' in combined:
        return 'Hana Bakery'
    if 'lavetta' in combined:
        return 'Lavetta Dairy'
    if 'lozena' in combined:
        return 'Lozena Foods'
    if 'abu farwa' in combined:
        return 'Abu Farwa Agro-Foods'
    if 'tii' in combined:
        return 'TII (Technology Innovation Institute)'
    if 'dtec' in combined:
        return 'DTEC (Dubai Silicon Oasis)'
    if 'centaur' in combined:
        return 'Centaur Electro-Mechanical'
    if 'kia gold' in combined:
        return 'Kia Gold Foods'
    if 'etihad rail' in combined:
        return 'Etihad Rail'
    if 'shaam hospital' in combined or 'ehs' in combined:
        return 'Emirates Health Services (EHS)'
    if 'marbella' in combined:
        return 'Marbella Food Industries'
    if 'el-sham3dan' in combined or 'sham3dan' in combined:
        return 'El-Shamadan Confectionery'
    if 'october food' in combined:
        return 'October Food Industries'
    if 'oreen' in combined:
        return 'Oreen Foods'
    if 'cairo foods' in combined:
        return 'Cairo Foods Co.'
    if 'nedaa' in combined:
        return 'Nedaa (Professional Communication Corp.)'
    if 'mbrf' in combined or 'mbrl' in combined:
        return 'MBRF / Mohammed Bin Rashid Al Maktoum Foundation'
    
    # Fallback to title prefix
    first_part = title.split('—')[0].split('-')[0].split('(')[0].strip()
    return first_part if len(first_part) > 2 else 'Private Client / Commission'

def determine_sector(cat, client, title, tags):
    combined = (title + " " + " ".join(tags) + " " + client).lower()
    if 'police' in combined or 'municipality' in combined or 'government' in combined or 'rail' in combined:
        return 'Government, Defense & Public Infrastructure'
    if 'hospital' in combined or 'polyclinic' in combined or 'health' in combined:
        return 'Healthcare, Medical & Wellness'
    if 'cosmetic' in combined or 'incense' in combined or 'soap' in combined or 'beauty' in combined:
        return 'Beauty, Fragrance & Personal Care'
    if 'book' in combined or 'fair' in combined or 'festival' in combined or 'conference' in combined:
        return 'Culture, Literature & Major Public Events'
    if 'date' in combined or 'dates' in combined:
        return 'Gourmet Agro-Food & Traditional Gifting'
    if 'chocolate' in combined or 'biscuit' in combined or 'cookie' in combined or 'wafer' in combined or 'croissant' in combined:
        return 'Confectionery, Snacks & Bakery FMCG'
    if 'cheese' in combined or 'milk' in combined:
        return 'Dairy Products & Everyday FMCG'
    if 'canned' in combined or 'beans' in combined or 'fries' in combined or 'tuna' in combined or 'rice' in combined or 'flour' in combined:
        return 'Packaged Foods & Pantry Essentials'
    if 'tea' in combined or 'coffee' in combined:
        return 'Hot Beverages, Coffee & Herbal Infusions'
    if cat == 'Spaces':
        return 'Corporate Exhibitions & Experiential Spaces'
    if cat == 'Packaging':
        return 'FMCG & Consumer Packaging'
    if cat == 'Branding':
        return 'Corporate Identity & Brand Strategy'
    return 'Creative Visual Arts & Graphic Media'

def determine_discipline(cat, tools, title):
    tools_str = " ".join(tools).lower()
    title_lower = title.lower()
    if cat == 'Packaging':
        if '3d' in tools_str or 'max' in tools_str or 'blender' in tools_str:
            return 'Packaging Design & 3D Structural Modeling'
        return 'FMCG Packaging Design & Visual Systems'
    if cat == 'Spaces':
        if 'interior' in title_lower or 'hospital' in title_lower or 'reception' in title_lower:
            return 'Interior Environment & Spatial Graphics'
        return 'Exhibition Stand Architecture & Environmental Graphics'
    if cat == 'Branding':
        return 'Brand Identity, Packaging & Graphic Communication'
    return 'Illustration, Editorial Art & Graphic Concepts'

def extract_team(text_blocks):
    for t in text_blocks:
        clean = clean_text(t)
        if 'designers team' in clean.lower() or 'collaboration' in clean.lower() or 'umi' in clean.lower():
            return clean
    return None

def determine_specs(order, cat, client, title):
    title_lower = title.lower()
    client_lower = client.lower()
    
    if order == 1:
        return {
            'accent': '#d4b36a',
            'palette': [
                {'name': 'Desert Sand', 'hex': '#E6DAC4', 'note': 'Rigid Carton Surface'},
                {'name': 'Royal Gold Foil', 'hex': '#D4B36A', 'note': 'Hot Foil Calligraphy'},
                {'name': 'Terracotta Caravan', 'hex': '#8D4C32', 'note': 'Illustrated Heritage'},
                {'name': 'Medjool Deep Amber', 'hex': '#362217', 'note': 'Typography & Framing'}
            ],
            'printSpecs': [
                'Hot Foil Stamping (Liquid Gold)',
                'Curved Viewing Window Die-Cut',
                '350gsm Food-Grade SBS Folding Board',
                'Matte Soft-Touch Velvet Lamination',
                'Precision Embossed Geometric Border'
            ],
            'typography': 'Custom Arabic Diwani Calligraphy & Contemporary Latin Serif'
        }

    if 'velora' in client_lower:
        return {
            'accent': '#2e6b52',
            'palette': [
                {'name': 'Forest Pine', 'hex': '#1E3D30', 'note': 'Primary Box'},
                {'name': 'Warm Terracotta', 'hex': '#BD6849', 'note': 'Botanical Accent'},
                {'name': 'Natural Linen', 'hex': '#EDE8DF', 'note': 'Sleeve Stock'},
                {'name': 'Dark Basalt', 'hex': '#212423', 'note': 'Editorial Copy'}
            ],
            'printSpecs': [
                'Uncoated Textured Cotton Board',
                'Blind Letterpress Debossing',
                'Matte Copper Foil Accents',
                'Rigid Slide-Out Tray Box'
            ],
            'typography': 'High-Contrast Classical Serif & Clean Modern Monospace'
        }

    if 'police' in client_lower:
        return {
            'accent': '#00a86b',
            'palette': [
                {'name': 'Dubai Police Green', 'hex': '#005D37', 'note': 'Official Identity'},
                {'name': 'Cyber Neon Green', 'hex': '#00E88F', 'note': 'Lighting & Digital Accent'},
                {'name': 'Stealth Graphite', 'hex': '#1A1D20', 'note': 'Architectural Trusses'},
                {'name': 'Pure Titanium White', 'hex': '#F8FAFC', 'note': 'Wayfinding Graphics'}
            ],
            'printSpecs': [
                'Direct UV Flatbed Print on Acrylic',
                'Backlit Tension Fabric Walls',
                'Integrated LED Contour Channeling',
                'Powder-Coated Architectural Framing'
            ],
            'typography': 'Official Dubai Police Typeface & Precision Technical Sans'
        }

    if 'bonatella' in client_lower:
        return {
            'accent': '#7838b0',
            'palette': [
                {'name': 'Playful Purple', 'hex': '#6F31A8', 'note': 'Dominant Shelf Color'},
                {'name': 'Cocoa Warm Orange', 'hex': '#F7861B', 'note': 'Character Accent'},
                {'name': 'Marshmallow Cream', 'hex': '#FFF4E0', 'note': 'Background Softness'},
                {'name': 'Dark Truffle', 'hex': '#3D1C12', 'note': 'Product Typography'}
            ],
            'printSpecs': [
                'Multi-layer Metallized Barrier Film',
                'High-Gloss Vibrant 8-Color Gravure',
                'Precision Tear-Notch Sachet Die-Cut',
                'Shrink-Sleeve Glass Jar Wrapper'
            ],
            'typography': 'Friendly Illustrated Display Sans & Rounded Legibility Text'
        }

    if 'mixly' in client_lower:
        return {
            'accent': '#e05844',
            'palette': [
                {'name': 'Fresh Strawberry Red', 'hex': '#DC3D32', 'note': 'Primary Flavor SKU'},
                {'name': 'Zesty Peach', 'hex': '#FF8A5B', 'note': 'Label Accent'},
                {'name': 'Pristine Cream', 'hex': '#FBF6EE', 'note': 'Label Stock'},
                {'name': 'Jam Rich Plum', 'hex': '#4A1525', 'note': 'Logotype'}
            ],
            'printSpecs': [
                'Waterproof Textured Polypropylene Label',
                'Tactile Rotary Spot UV on Fruit Art',
                'Custom Fluted Glass Jar Die-Cut Wrap'
            ],
            'typography': 'Bespoke Playful Script Wordmark & Modern Sans'
        }

    # Fallback based on category
    if cat == 'Packaging':
        return {
            'accent': '#d4b36a',
            'palette': [
                {'name': 'Brand Primary', 'hex': '#C9A356', 'note': 'Hero Hue'},
                {'name': 'Secondary Accent', 'hex': '#E86438', 'note': 'Dynamic Contrast'},
                {'name': 'Clean Neutral', 'hex': '#F5F2EB', 'note': 'Substrate'},
                {'name': 'Deep Contrast', 'hex': '#222326', 'note': 'Copy'}
            ],
            'printSpecs': [
                'Custom Structural Box Die-Line',
                'Matte Soft-Touch Lamination',
                'Selective Spot Gloss UV Detailing',
                'Food-Grade Certified Packaging Substrate'
            ],
            'typography': 'Custom Display Typography & Clean Functional Sans'
        }
    elif cat == 'Spaces':
        return {
            'accent': '#009966',
            'palette': [
                {'name': 'Spatial Primary', 'hex': '#007A4D', 'note': 'Facade Hue'},
                {'name': 'Accent Lighting', 'hex': '#2AD59B', 'note': 'Illuminated Glow'},
                {'name': 'Architectural Slate', 'hex': '#181A1D', 'note': 'Wall Finishes'},
                {'name': 'Off-White', 'hex': '#F2F4F7', 'note': 'Environmental Type'}
            ],
            'printSpecs': [
                'Large-Format Seamless Fabric Graphics',
                'Backlit Tension Matrix System',
                'Die-Cut Vinyl Wall & Floor Wayfinding',
                'Matte Architectural Coating'
            ],
            'typography': 'Architectural Monumental Display & International Wayfinding Sans'
        }
    elif cat == 'Branding':
        return {
            'accent': '#d4b36a',
            'palette': [
                {'name': 'Brand Core', 'hex': '#CCA052', 'note': 'Identity Base'},
                {'name': 'Support Hue', 'hex': '#684534', 'note': 'Brand Warmth'},
                {'name': 'Canvas Light', 'hex': '#FAF7F2', 'note': 'Stationery'},
                {'name': 'Core Black', 'hex': '#1B1C20', 'note': 'Logotype'}
            ],
            'printSpecs': [
                'Pantone Metallic Ink Formulation',
                'Letterpress Impression on 400gsm Cotton',
                'Foil Stamped Monogram Detailing',
                'Embossed Corporate Guidelines Binder'
            ],
            'typography': 'Distinctive Proprietary Logotype & Editorial Serif'
        }
    else:
        return {
            'accent': '#b89050',
            'palette': [
                {'name': 'Artisan Ochre', 'hex': '#C8963E', 'note': 'Primary Pigment'},
                {'name': 'Burnt Umber', 'hex': '#5E3825', 'note': 'Contour Tone'},
                {'name': 'Parchment Raw', 'hex': '#EFE9DE', 'note': 'Paper Surface'},
                {'name': 'Sumi Ink', 'hex': '#141416', 'note': 'Inking Line'}
            ],
            'printSpecs': [
                'Archival 310gsm Cotton Rag Paper',
                'Pigment Fine Art Giclée Print',
                'Hand-Deckled Paper Edges'
            ],
            'typography': 'Original Calligraphic Hand-Lettering'
        }

def build_case_study(p, s, dist_p):
    pid = str(p['id'])
    order = dist_p['order']
    title = clean_text(p['title'])
    cat = dist_p['category']
    categories = dist_p['categories']
    year = dist_p['year']
    tools = p.get('tools', dist_p.get('tools', []))
    tags = p.get('tags', dist_p.get('tags', []))
    desc = clean_text(p.get('description', ''))
    raw_texts = [clean_text(t) for t in p.get('text_blocks', []) if clean_text(t)]
    
    stats = s.get('stats', {})
    views = stats.get('views', {}).get('all', 0)
    appreciations = stats.get('appreciations', {}).get('all', 0)
    
    client = determine_client(title, tags, raw_texts)
    sector = determine_sector(cat, client, title, tags)
    discipline = determine_discipline(cat, tools, title)
    role = 'Lead Environmental & Graphic Designer' if cat == 'Spaces' else ('Lead Packaging & Brand Designer' if cat == 'Packaging' else 'Senior Visual Identity Designer')
    team = extract_team(raw_texts)
    
    # Custom detailed challenge & solution based on project specifics
    combined_notes = (desc + " " + " ".join(raw_texts)).strip()
    
    # Check for video
    featured_video = None
    project_dir = os.path.join('dist/assets/projects', pid)
    if os.path.exists(project_dir):
        mp4_files = [f for f in os.listdir(project_dir) if f.endswith('.mp4')]
        if pid == '179167819':
            featured_video = {
                'src': f'/assets/projects/{pid}/zain-dates-showcase.mp4',
                'title': 'Zain Medjool Dates — 3D Product Motion Showcase',
                'badge': 'Product in Motion',
                'caption': 'High-fidelity 3D motion packaging showcase in an atmospheric desert sunset setting with rotating structural box and foil reflections.'
            }
        elif mp4_files:
            v_name = mp4_files[0]
            featured_video = {
                'src': f'/assets/projects/{pid}/{v_name}',
                'title': f'{title} — Motion Showcase',
                'badge': 'Dynamic Motion',
                'caption': f'Animated visual assets and dynamic presentation developed for {title}.'
            }
            
    # Build challenge & solution tailored to the category & specific text
    if cat == 'Packaging':
        challenge = (
            f"Develop a high-impact packaging architecture for {client} that balances immediate shelf visibility with authentic brand storytelling. "
            f"The design required establishing a clear visual hierarchy, integrating essential regulatory and nutritional specifications, "
            f"and selecting a material finish that conveys product freshness and premium value within the competitive {sector.lower()} category."
        )
        if desc:
            solution = desc + (" " + raw_texts[0] if raw_texts and len(raw_texts[0]) > 40 and raw_texts[0] not in desc else "")
        else:
            solution = (
                f"Crafted a cohesive visual system built around distinctive color palettes, bespoke typography, and tailored illustration elements. "
                f"The structural layout was engineered to highlight key product attributes while maintaining production feasibility across multiple SKUs and formats. "
                f"Carefully balanced negative space with textural detailing to create a memorable tactile and visual consumer experience."
            )
        highlights = [
            f"Custom packaging structural layout & dieline engineering",
            f"Cohesive visual hierarchy optimized for retail shelf presence",
            f"Tailored color palette and typographic system",
            f"Comprehensive SKU adaptation and production-ready artwork files",
            f"Photorealistic 3D visualization and presentation mockups"
        ]
    elif cat == 'Spaces':
        challenge = (
            f"Design an immersive spatial and environmental graphic identity for {client} at scale. "
            f"The environment needed to communicate cutting-edge authority, guide visitor circulation effortlessly, "
            f"and translate the brand's core institutional values into a three-dimensional physical journey."
        )
        if desc:
            solution = desc
        else:
            solution = (
                f"Developed an architectural graphic system integrating bold monumental typography, precision lighting accents, "
                f"and large-format environmental graphics. The space harmonizes digital interactivity with physical form, "
                f"ensuring an unforgettable brand experience from primary sightlines to intimate interactive touchpoints."
            )
        highlights = [
            f"Large-format environmental graphic identity & wayfinding",
            f"3D spatial modeling and photometric lighting rendering",
            f"Brand-consistent architectural materials and finish palette",
            f"Integration of digital interactive zones and ceremonial areas",
            f"Technical fabrication supervision specifications"
        ]
    elif cat == 'Branding':
        challenge = (
            f"Establish a distinct, multifaceted visual brand identity for {client} that commands attention and scales seamlessly across digital, print, and physical touchpoints. "
            f"The system needed to express brand integrity while remaining versatile for diverse marketing channels."
        )
        solution = desc if desc else (
            f"Created a holistic brand ecosystem featuring custom logotype development, an evocative color palette, "
            f"and modular graphic assets. The resulting identity establishes emotional resonance with target audiences and provides clear guidelines for consistent multi-channel execution."
        )
        highlights = [
            f"Primary logotype and secondary mark architecture",
            f"Bespoke brand guidelines and color hierarchy",
            f"Multi-touchpoint applications across stationery and promotional collateral",
            f"Packaging and editorial system design",
            f"Digital asset toolkit and social media templates"
        ]
    else: # Artworks
        challenge = (
            f"Explore visual storytelling, medium experimentation, and thematic expression through bespoke graphic artwork for {title}. "
            f"The work addresses the interplay of texture, light, and narrative concept."
        )
        solution = desc if desc else (
            f"Executed a dynamic artistic concept combining mixed media, traditional drafting techniques, and digital refinement. "
            f"The resulting compositions evoke nuanced emotion and celebrate intricate handcraftsmanship."
        )
        highlights = [
            f"Original conceptual illustration & narrative development",
            f"Mixed traditional and digital media workflow",
            f"Expressive color harmonization and typographic accents",
            f"High-resolution exhibition and print preparation"
        ]

    # Specific override for Project 1: Al-Amir / Zain Dates
    if order == 1:
        client = 'Al-Amir & Zain Dates (تمور زين)'
        discipline = 'Luxury FMCG Packaging & 3D Visualization'
        sector = 'Gourmet Food & Traditional Arabian Dates'
        challenge = (
            'The client required an authentic, premium packaging design for Medjool Dates that embodies traditional Arabian heritage '
            'while competing with world-class luxury gourmet brands. The packaging needed to integrate existing logos seamlessly, '
            'provide a die-cut viewing window showcasing the natural texture and quality of the dates, and evoke the warmth and hospitality of the Arabian desert.'
        )
        solution = (
            'Crafted a sophisticated packaging aesthetic pairing warm desert sand hues with hand-rendered illustrations of palm oases and Bedouin caravan silhouettes. '
            'The typographic layout highlights custom Arabic calligraphy for "تمور زين" alongside modern Latin typography, creating a harmonious bilingual identity. '
            'An arched organic die-cut window allows the dates to shine through, framed by traditional geometric arabesque borders and subtle gold accents.'
        )
        highlights = [
            'Structural carton packaging with curved die-cut product viewing window',
            'Bespoke hand-illustrated oasis and desert caravan heritage artwork',
            'Harmonious bilingual typography (Arabic calligraphy & clean Latin serif)',
            'Warm desert sand, terracotta, and gold foil aesthetic palette',
            'Full dielines, printing specifications, and production-ready prepress files',
            'Cinematic 3D animation showcase and interactive WebGL 3D model study'
        ]

    specs = determine_specs(order, cat, client, title)

    return {
        'client': client,
        'discipline': discipline,
        'sector': sector,
        'year': year,
        'role': role,
        'team': team,
        'challenge': challenge,
        'solution': solution,
        'highlights': highlights,
        'views': views,
        'appreciations': appreciations,
        'featuredVideo': featured_video,
        'cleanTitle': title,
        'accent': specs['accent'],
        'palette': specs['palette'],
        'printSpecs': specs['printSpecs'],
        'typography': specs['typography']
    }

# Update all dist projects
for dist_p in dist_projects:
    pid = str(dist_p['id'])
    s_p = behance_by_id.get(pid, {})
    cs = build_case_study(s_p, s_p, dist_p)
    dist_p['caseStudy'] = cs
    # Also update description if empty or minimal
    if not dist_p.get('description') or len(dist_p['description']) < 30:
        dist_p['description'] = cs['solution']

with open('dist/data.json', 'w', encoding='utf-8') as f:
    json.dump(dist_projects, f, ensure_ascii=False, indent=2)

print(f"Successfully generated Case Study data for all {len(dist_projects)} projects in dist/data.json!")
