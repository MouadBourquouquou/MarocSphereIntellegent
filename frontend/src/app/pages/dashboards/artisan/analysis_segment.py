from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<ng-container *ngIf="productModalOpen()"')
end = text.index('</ng-container>', start) + len('</ng-container>')
segment = text[start:end]
pattern = re.compile(r'<(/?)([a-zA-Z0-9\-]+)([^>]*)>')
count=0
for m in pattern.finditer(segment):
    closing = m.group(1) == '/'
    tag = m.group(2)
    full = m.group(0)
    if tag in {'br','img','input','hr','meta','link','area','base','col','embed','source','track','wbr'} or full.endswith('/>'):
        continue
    action = 'CLOSE' if closing else 'OPEN '
    print(f'{count:03d} {action} {tag} line {segment[:m.start()].count("\n") +1} text={full}')
    count += 1
