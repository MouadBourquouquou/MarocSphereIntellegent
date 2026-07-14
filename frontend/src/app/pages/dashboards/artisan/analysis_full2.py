from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
pattern = re.compile(r'<(/?)([a-zA-Z0-9\-]+)([^>]*)>')
stack=[]
self_closing={'br','img','input','hr','meta','link','area','base','col','embed','source','track','wbr'}
for m in pattern.finditer(text):
    closing=m.group(1)=='/'
    tag=m.group(2)
    full=m.group(0)
    if tag in self_closing or full.endswith('/>'):
        continue
    if closing:
        if stack and stack[-1]==tag:
            stack.pop()
        else:
            pos=m.start();
            line=text[:pos].count('\n')+1
            print('Mismatch', tag, 'line', line, 'stack top', stack[-1] if stack else None, 'stack len', len(stack))
            print('last tags', stack[-20:])
            break
    else:
        stack.append(tag)
print('final stack len', len(stack), 'top', stack[-10:])
