<script lang="ts">
  export let src: string | undefined;
  export { classes as class };
  export let title: string | undefined;
  export let href: string;

  let classes = "";
</script>

<a {href} class="shrink-0">
  <div
    class="z-1 relative shrink-0 duration-500 group lg:hover:scale-110 {classes}"
  >
    <div
      class="relative lg:block hero-image lg:rounded-lg rounded overflow-hidden transition-all duration-500"
    >
      <img
        {src}
        class="relative lg:group-hover:opacity-90 duration-500 block h-[120px] w-[80px] lg:h-[450px] lg:w-[300px] transition-all object-cover select-none sm:block animate-blur-in z-10"
        aria-hidden="true"
        draggable="false"
        alt=""
      />
      <p
        class="absolute text-center lg:block hidden bottom-0 py-4 right-0 text-2xl px-5 opacity-0 transition duration-500 bg-black/70 lg:group-hover:opacity-100 w-full z-10 font-bold"
      >
        {title}
      </p>
    </div>
    <img
      class="scale-95 pointer-events-none lg:block hidden lg:group-hover:opacity-75 transition duration-500 absolute top-8 -z-1 h-[80px] w-[80px] lg:h-[400px] lg:w-[400px] select-none rounded-full opacity-0 blur-2xl filter lg:left-auto left-0"
      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGgAAAwEAAwAAAAAAAAAAAAAAAAQHBgIDCP/EACsQAAIBAwMCBAYDAAAAAAAAAAECAwAEEQUSITFBBhMUMgciUWFxgaGx8f/EABkBAQEBAAMAAAAAAAAAAAAAAAMCBQEEBv/EACURAAEDAwMEAwEAAAAAAAAAAAEAAgMEESESMUEFExTRgZGh8P/aAAwDAQACEQMRAD8Abl0M7uBSkmjtwNvPPNVKTTQT0rpbSQe1K2tW0adhUufSCQAFxjqfrQNHZmwEqmtoyt1XNC6SM+2r81T4zVO4NDYnpRVMj0sKelFEa03SCnYEra+N9JnuvIcukuzfgcgY+prK3Pxh0218R3dpNZk6XEo8u7V/mdsZOEx0zgVL9nqZNixpIApKEEde/wCelZ2G40ybULZ7uzkWRgxZEIA4/Xf8VxFTxOJvwE9SwscA0WB5/LK723xm0KWdVlsbyGB+FmbBB/Va6x8Z+GtQyLLVIJHA9hyp/kV5/wBUl0/0LXMsTm0ChtuRuBHYf5S1peLPaJNYRLDAR8sbN8wY9s9+lS6Fjmaw23G6o0+mTth1za/P8FfrjxfYqQEQqVOPdxnvRUNhIWSW5NyFghG9t3TJHAGOepoovGe4XZayqWroaZ3bqMH5OPpZ42iwtbRvBPaxudqz+YCGP3UcimpbS00wNPNN6sudoYgps/Ayc0UVo9QYIzG1mNQyg6VM6eN8kmSDhL6jcRro8bAB3x3UbQD/AHSF1Lc2+SZ0bPujBz5f0H2oooITqBB29LszjtkFu/tcY72CHR1WZiXdiqqOwHc/uiiiteGGMMGF5uskMkl3cY2X/9k="
      aria-hidden="true"
      draggable="false"
      alt=""
    />
  </div>
</a>
