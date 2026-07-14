from pathlib import Path
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<ng-container *ngIf="productModalOpen()"')
end = text.index('</ng-container>', start) + len('</ng-container>')
seg = text[start:end]
print('open_div', seg.count('<div'))
print('close_div', seg.count('</div>'))
print('open_ng', seg.count('<ng-container'))
print('close_ng', seg.count('</ng-container>'))
