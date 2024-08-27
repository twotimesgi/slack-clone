interface WorkspaceIdPageProps {
  params: {
    id: string;
  };
}

const WorkspaceIdPage = ({params}: WorkspaceIdPageProps) => {
    return <div>Workspace ID: {params.id}</div>;
    }

export default WorkspaceIdPage;