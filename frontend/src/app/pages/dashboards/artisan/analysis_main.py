from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start=text.index('<main class="max-w-7xl mx-auto px-4 md:px-6 py-8 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">')
end=text.index('</main>', start)+len('</main>')
seg=text[start:end]
pattern=re.compile(r'<(/?)([a-zA-Z0-9\-]+)([^>]*)>')
stack=[]
self_closing={'br','img','input','hr','meta','link','area','base','col','embed','source','track','wbr'}
for m in pattern.finditer(seg):
    closing=m.group(1)=='/'
    tag=m.group(2)
    full=m.group(0)
    if tag in self_closing or full.endswith('/>'):
        continue
    if closing:
        if stack and stack[-1]==tag:
            stack.pop()
        else:
            print('Mismatch in main', tag, 'line', seg[:m.start()].count('\n')+1, 'stack top', stack[-1] if stack else None)
            break
    else:
        stack.append(tag)
print('remaining in main', len(stack), stack[-10:])
