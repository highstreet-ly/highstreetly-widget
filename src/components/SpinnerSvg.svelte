<script>
  export let spinnerPx, spinnerColor, spinnerClass;
  spinnerPx = (spinnerPx ? spinnerPx : 60);
  spinnerColor = (spinnerColor ? spinnerColor : '#000');
  spinnerClass = (spinnerClass ? spinnerClass: '');
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    style="image-rendering:optimizeQuality;shape-rendering:geometricPrecision;text-rendering:geometricPrecision"
    viewBox="0 0 300 300"
    height="{spinnerPx}"
    width="{spinnerPx}"
    class="{spinnerClass} inline-block">
  <g id="g70" transform="translate(-17,-40)">
    <path
        style="fill:{spinnerColor};height:{spinnerPx}px;width:{spinnerPx}px;"
        d="m 143,198 h 122 c 20,0 20,32 0,32 H 140 c -9,0 -19,0 -22,-11 L 71,65 H 32 C 12,65 12,40 32,40 h 53 c 11,0 13,8 15,14 l 8,28 h 194 c 10,0 15,10 15,18 l -19,72 c -2,5 -7,10 -14,10 H 138 Z m 110,43 c 14,0 26,12 26,26 0,15 -12,26 -26,26 -14,0 -26,-11 -26,-26 0,-14 12,-26 26,-26 z m -106,0 c 14,0 26,12 26,26 0,15 -12,26 -26,26 -14,0 -26,-11 -26,-26 0,-14 12,-26 26,-26 z"
        id="path68"/>
  </g>
</svg>