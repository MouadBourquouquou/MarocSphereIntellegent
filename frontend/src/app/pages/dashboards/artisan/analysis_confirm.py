from pathlib import Path
import re
text = Path('dashArtisan.html').read_text(encoding='utf-8')
start = text.index('<div *ngIf="confirmDeleteModal()"')
end = text.index('</div>', start) + len('</div>')
# We need maybe the first closing div is the overlay? Better use a quick parse of segment around it.
seg = text[start:start+500]
print(seg)
