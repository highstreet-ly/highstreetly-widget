<script>
  export let svgPx, svgColor, svgClass;
  svgPx = svgPx || 60;
  svgColor = svgColor || '#000';
  svgClass = svgClass || '';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    style="image-rendering:optimizeQuality;shape-rendering:geometricPrecision;text-rendering:geometricPrecision"
    viewBox="0 0 512 512"
    height="{svgPx}"
    width="{svgPx}"
    class="{svgClass} inline-block">
  <path
      style="fill:{svgColor};height:{svgPx}px;width:{svgPx}px;"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z">
  </path>
</svg>
