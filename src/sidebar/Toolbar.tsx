import "./Toolbar.css";

export default function Toolbar() {
  return (
    <div className="Toolbar">
      <span className="icon-create-file" title="Create File"></span>
      <span className="icon-create-dir" title="Create Folder"></span>
      <span className="icon-close" title="Delete"></span>
    </div>
  );
}
