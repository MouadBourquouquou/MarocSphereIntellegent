from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<ng-container *ngIf="orderDetailOpen() && selectedOrder()"')
end = text.index('</ng-container>', start) + len('</ng-container>')
seg = text[start:end]
print('open div', seg.count('<div'))
print('close div', seg.count('</div>'))
print('open ng', seg.count('<ng-container'))
print('close ng', seg.count('</ng-container>'))
pattern = re.compile(r'<(/?)(div|ng-container)([^>]*)>')
stack=[]
for m in pattern.finditer(seg):
    closing=m.group(1)=='/'
    tag=m.group(2)
    if not closing:
        stack.append(tag)
    else:
        if stack and stack[-1]==tag:
            stack.pop()
        else:
            print('mismatch', tag, 'stack top', stack[-1] if stack else None)
            break
print('remaining stack', stack)
