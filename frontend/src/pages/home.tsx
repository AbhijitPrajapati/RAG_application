import QueryBox from "../components/QueryBox";
import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <FileUploader />
      <QueryBox />
    </div>
  );
}