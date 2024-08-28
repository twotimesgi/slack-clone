"use client" 

import { Sidebar } from "./components/sidebar";
import { Toolbar } from "./components/toolbar";
interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout= ({children} : WorkspaceIdLayoutProps) => {
    return (
        <div className="h-full">
            <Toolbar/>
            <div className="flex h-[calc(100%-40px)]">
                <Sidebar/>
            {children}
            </div>
        </div>
    )

};

 export default WorkspaceIdLayout;