<script lang="ts">
  export { classes as class };

  let classes = "";

  const speed = "0.6s";
  const width = 430;
  const spaceBetween = (width - 300) / 2;
  const easeProps = {
    keyTimes: "0; 1",
    keySplines: "0.25 0.1 0.25 1",
    calcMode: "spline",
  };
</script>

<div class={classes}>
  <svg viewBox="0 0 {width} 120" xmlns="http://www.w3.org/2000/svg">
    <!-- scaler -->
    <circle cx="50" cy="60" r="50">
      <animate
        dur={speed}
        attributeName="r"
        values="0; 50"
        repeatCount="indefinite"
        {...easeProps}
      />
    </circle>

    <!-- mover -->
    <circle cx="50" cy="60" r="50">
      <animateMotion
        dur={speed}
        repeatCount="indefinite"
        path="M0 0 l+{100 + spaceBetween} 0"
        {...easeProps}
      />
    </circle>

    <!-- mover -->
    <circle cx={150 + spaceBetween} cy="60" r="50">
      <animateMotion
        dur={speed}
        repeatCount="indefinite"
        path="M0 0 l+{100 + spaceBetween} 0"
        {...easeProps}
      />
    </circle>

    <!-- scaler -->
    <circle cx={250 + spaceBetween * 2} cy="60" r="50">
      <animate
        dur={speed}
        attributeName="r"
        values="50; 0"
        repeatCount="indefinite"
        {...easeProps}
      />
    </circle>
  </svg>
</div>
