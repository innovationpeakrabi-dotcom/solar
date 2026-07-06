export const formatNumber = (value: number) =>
  new Intl.NumberFormat("th-TH").format(value);

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
