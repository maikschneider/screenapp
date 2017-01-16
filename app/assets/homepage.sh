#!/bin/sh
find scss/ -name '*.scss' | \
    entr sassc \
    --load-path bower_components/foundation-sites/scss \
    --load-path bower_components/bourbon/app/assets/stylesheets \
    --load-path bower_components/motion-ui/src \
    --load-path bower_components/font-awesome/scss \
    scss/homepage.scss \
    styles/homepage.css
