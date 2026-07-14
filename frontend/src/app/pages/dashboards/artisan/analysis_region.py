from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
# region from line 400 onwards to end
start = text.splitlines(True)
# determine actual char offset for line 400
charpos = sum(len(line) for line in start[:400])
seg = text[charpos:]
pattern = re.compile(r'<(/?)(div|ng-container|main)([^>]*)>')
stack=[]
for m in pattern.finditer(seg):
    closing=m.group(1)=='/'
    tag=m.group(2)
    full=m.group(0)
    line = seg[:m.start()].count('\n')+401
    if tag in {'br','img','input','hr','meta','link','area','base','col','embed','source','track','wbr'} or full.endswith('/>'):
        continue
    if closing:
        if stack and stack[-1]==tag:
            stack.pop()
        else:
            print('Mismatch', tag, 'line', line, 'stack', stack)
            break
    else:
        stack.append(tag)
print('final stack', stack)
