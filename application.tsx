import { Leva, useControls } from "leva";
// import SquareBox from "./square-box";

interface ApplicationProps {}

const Application = (props: ApplicationProps) => {
  const values = useControls({
    idx: 0,
    dir: "dir"
  });

  return (
    <>
      <Leva />
    </>
  );
};

export default Application;
