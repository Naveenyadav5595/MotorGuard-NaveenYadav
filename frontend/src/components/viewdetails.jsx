import { useParams } from "react-router-dom";
import MotorDetails from "../pages/motordetails";

function ViewDetails() {
  const { motorId } = useParams();

  return <MotorDetails motorId={motorId} />;
}

export default ViewDetails;