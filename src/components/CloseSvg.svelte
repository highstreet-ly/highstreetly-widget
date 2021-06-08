<script>
  export let svgPx, svgColor, svgClass;
  svgPx = svgPx || 60;
  svgColor = svgColor || '#000';
  svgClass = svgClass || '';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    style="image-rendering:optimizeQuality;shape-rendering:geometricPrecision;text-rendering:geometricPrecision"
    viewBox="0 0 100 100"
    height="{svgPx}"
    width="{svgPx}"
    class="{svgClass} inline-block">
  <g id="g70">
    <path
        style="fill:{svgColor};height:{svgPx}px;width:{svgPx}px;"
        d="M 50,0 C 22.4,0 0,22.4 0,50 0,77.6 22.4,100 50,100 77.6,100 100,77.6 100,50 100,22.4 77.6,0 50,0 Z M 73.1,65.4 65.4,73.1 50,57.7 34.6,73.1 26.9,65.4 42.3,50 26.9,34.6 34.6,26.9 50,42.3 65.4,26.9 73.1,34.6 57.7,50 Z"
    />
  </g>
</svg>