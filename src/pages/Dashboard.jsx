import AIFiltered from "../components/AIFiltered";
import DashboardHeader from "../components/DashboardHeader";
import FaceImage from "../components/FaceImage";
import MatchedImages from "../components/MatchedImages";
import RecentlyUploaded from "../components/RecentUploaded";
import Footer from "../components/Footer";

const headers = [
  { name: "Exam Name", accessor: "exam_name", class: "p-2" },
  { name: "Class Name", accessor: "class_name", class: "p-2" },
  { name: "Section Name", accessor: "section_name", class: "p-2" },
  { name: "Subject Name", accessor: "subject_name", class: "p-2" },
  { name: "View", accessor: "actions", class: "p-2" },
];

const Dashboard = () => {

  return (
    <>
      <DashboardHeader />
      <div className="p-8 pb-2">
        <FaceImage />
        <MatchedImages />
        <RecentlyUploaded />
        <AIFiltered />
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
