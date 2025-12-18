import React from 'react';
import { BsFileEarmark, BsFolder, BsTrash } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/useProject';
import type { InputAsset } from '@/lib/projectApi';

const getAssetIcon = (_format: string) => {
    // TODO: Use format to show different icons per file type
    return <BsFileEarmark className="w-5 h-5 text-muted-foreground" />;
};

interface AssetItemProps {
    asset: InputAsset;
    onRemove?: (assetId: string) => void;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, onRemove }) => {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-base-200 transition-colors group border-b border-base-200 last:border-b-0">
            <div className="flex-shrink-0">
                {getAssetIcon(asset.format)}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-base-foreground truncate">
                        {asset.fileName}
                    </span>
                    <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-base-200 rounded border border-base-300 uppercase">
                        {asset.format}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {asset.path}
                </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                    {new Date(asset.importedAt).toLocaleDateString()}
                </span>
                {onRemove && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemove(asset.id)}
                    >
                        <BsTrash className="w-4 h-4 text-error" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export const ProjectAssetsList: React.FC = () => {
    const { projectMetadata } = useProject();
    const assets: InputAsset[] = projectMetadata?.assets || [];

    if (assets.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-base-200">
                    <BsFolder className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                    No assets added yet. Import assets to get started.
                </p>
            </div>
        );
    }

    const handleRemoveAsset = (assetId: string) => {
        // TODO: Implementar eliminación de asset
        console.log('Remove asset:', assetId);
    };

    return (
        <div className="space-y-1">
            {assets.map((asset) => (
                <AssetItem
                    key={asset.id}
                    asset={asset}
                    onRemove={handleRemoveAsset}
                />
            ))}
        </div>
    );
};

