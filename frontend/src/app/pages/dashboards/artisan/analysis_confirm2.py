from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<div *ngIf="confirmDeleteModal()"')
end = text.index('</div>', text.index('<div *ngIf="confirmDeleteModal()"')) + len('</div>')
seg = text[start: text.index('</div>', text.index('<div *ngIf="confirmDeleteModal()"')) + len('</div>')]
print(seg)
