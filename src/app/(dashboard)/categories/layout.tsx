export default function DashboardLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div>{props.children}</div>
      <div>{props.modal}</div>
    </>
  );
}
