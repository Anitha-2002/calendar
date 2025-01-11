import React from 'react';
interface PageLayoutProps {
    variant: string;
}
export const PageLayout = ({variant}:PageLayoutProps) => {
    return (
            variant && (<div className="items-start border-2 text-blue-700">
                Hello World
            </div>)
    )
}