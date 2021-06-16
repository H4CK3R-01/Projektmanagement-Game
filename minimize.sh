#!/bin/sh
which uglifycss

#minification of JS files
cd public/js || exit
for f in *.js; do
  case "$f" in
    *"min.js") ;;
    *) uglifyjs "$f" > "${f%.js}".min.js && sed -i "s/$f/${f%.js}.min.js/" ../index.html
  esac
done

#minification of CSS files
cd ../css || exit
for f in *.css; do
  case "$f" in
    *"min.css") ;;
    *) uglifycss --output "${f%.css}".min.css "$f" && sed -i "s/$f/${f%.css}.min.css/" ../index.html
  esac
done
