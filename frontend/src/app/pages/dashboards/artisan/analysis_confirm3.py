from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<div *ngIf="confirmDeleteModal()"')
segment = text[start: start+400]
print(segment)
