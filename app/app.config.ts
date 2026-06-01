export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
    },
    input: {
      defaultVariants: {
        size: 'lg',
      },
    },
    select: {
      defaultVariants: {
        size: 'lg',
      },
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
      defaultVariants: {
        size: 'lg',
      },
    },
  },
})
