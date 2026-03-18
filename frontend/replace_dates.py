import re
import sys

def process(content):
    # Match <input ... placeholder="mm/dd/yyyy" ... /> or similar
    # we can just match line by line
    lines = content.split('\n')
    new_lines = []
    replaced = 0
    
    for line in lines:
        if '<input' in line and ('placeholder="mm/dd/yyyy"' in line.lower() or 'type="date"' in line.lower() or 'placeholder="mm/dd/yyyy"' in line.lower()):
            # We want to keep the label before it if possible, but the label is usually on the line above
            
            # extract value={...}
            value_match = re.search(r'value=\{([^}]+)\}', line)
            val = value_match.group(1) if value_match else ''
            
            # extract onChange={...}
            onchange_match = re.search(r'onChange=\{([^}]+)\}', line)
            if onchange_match:
                oc_str = onchange_match.group(1)
                if 'e.target.value' in oc_str:
                    oc_str = oc_str.replace('e.target.value', 'val')
                    oc_str = re.sub(r'\(?e\)?\s*=>', '(val) =>', oc_str)
                onchange = f"{{{oc_str}}}"
            else:
                onchange = "{() => {}}"
                
            # extract className="..." or className={...}
            class_match = re.search(r'className=(["`{][^"`}]+["`}])', line)
            if class_match:
                cls = class_match.group(1)
            else:
                cls = '""'
                
            # disabled?
            disabled = " disabled" if "disabled" in line else ""
            
            # Keep leading whitespace
            leading = len(line) - len(line.lstrip())
            indent = " " * leading
            
            new_line = f'{indent}<DatePicker value={{{val}}} onChange={onchange} className={cls}{disabled} />'
            new_lines.append(new_line)
            replaced += 1
        else:
            new_lines.append(line)
            
    # Add import DatePicker
    if replaced > 0:
        content_out = '\n'.join(new_lines)
        if 'import DatePicker' not in content_out:
            # find first line with import
            for i, l in enumerate(new_lines):
                if l.startswith("import "):
                    new_lines.insert(i, "import DatePicker from '../../components/common/DatePicker'")
                    break
        return '\n'.join(new_lines), replaced
    return content, 0

for filepath in sys.argv[1:]:
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()
    updated, count = process(original)
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated)
        print(f"Replaced {count} occurrences in {filepath}")
