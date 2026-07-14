from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
limit = 44833
segment = text[:limit]
pattern = re.compile(r'<(/?)([a-zA-Z0-9\-]+)([^>]*)>')
stack=[]
self_closing={'br','img','input','hr','meta','link','area','base','col','embed','source','track','wbr'}
for m in pattern.finditer(segment):
    closing = m.group(1) == '/'
    tag = m.group(2)
    full = m.group(0)
    if tag in self_closing or full.endswith('/>'):
        continue
    if closing:
        if stack and stack[-1] == tag:
            stack.pop()
        else:
            print('Mismatch before limit closing', tag, 'line', segment[:m.start()].count('\n')+1)
            break
    else:
        stack.append(tag)
print('stack before mismatch', stack[-10:], 'len', len(stack))
