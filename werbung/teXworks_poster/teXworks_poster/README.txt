TeXworks poster package

1. Open poster_texworks.tex in TeXworks.
2. Select XeLaTeX as the typesetting engine.
3. Compile.

The poster is set to the original 595.28 x 841.89 page size.
The text is organized as \newcommand definitions near the top so translations
can be pasted into those fields without editing the layout.

Two original image files were referenced by the supplied HTML but were not
embedded in the supplied files:
  image/R-_Retraite_en_Ligne_-_Laurent_de_la_R_surrection.jpg
  image/1.png

Create an "image" folder beside poster_texworks.tex and copy those two files
there. The .tex file will compile even if they are absent, but the missing
background/photo will show a placeholder.
