from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<ng-container *ngIf="productModalOpen()"')
end = text.index('</ng-container>', start) + len('</ng-container>')
seg = text[start:end]
pattern = re.compile(r'<(/?)(div|ng-container)([^>]*)>')
stack=[]
for m in pattern.finditer(seg):
    closing = m.group(1) == '/'
    tag = m.group(2)
    line = seg[:m.start()].count('\n')+1
    if not closing:
        stack.append(tag)
    else:
        if stack and stack[-1] == tag:
            stack.pop()
        else:
            print('Mismatch', tag, 'line', line, 'stack top', stack[-1] if stack else None)
            break
    print(f"line {line} {'OPEN' if not closing else 'CLOSE'} {tag} stack={stack}")
print('final stack', stack)
