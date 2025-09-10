import React from 'react';
import { 
    LuBox, // Model
    LuCamera, // Camera
    LuLayoutPanelTop, // Group (layout panel)
    LuLightbulb, // Light
    LuLayers, // Scene
    LuBone // Skeleton
} from 'react-icons/lu';

/**
 * Object types available in Zernikalos
 */
export type ZObjectType = 'SCENE' | 'MODEL' | 'GROUP' | 'CAMERA' | 'SKELETON' | 'LIGHT';

/**
 * Props for the ObjectTypeIcon component
 */
interface ObjectTypeIconProps {
    /** The type of 3D object */
    type: ZObjectType;
    /** Size of the icon */
    size?: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Icon mapping for different ZObject types
 */
const iconMap: Record<ZObjectType, React.ComponentType<{ size?: number; className?: string }>> = {
    SCENE: LuLayers,
    MODEL: LuBox,
    GROUP: LuLayoutPanelTop,
    CAMERA: LuCamera,
    SKELETON: LuBone,
    LIGHT: LuLightbulb,
};

/**
 * Component that renders an icon based on the ZObject type
 */
export const ObjectTypeIcon: React.FC<ObjectTypeIconProps> = ({ 
    type, 
    size = 16, 
    className = '' 
}) => {
    const IconComponent = iconMap[type];
    
    if (!IconComponent) {
        // Fallback to a generic box icon if type is not recognized
        return <LuBox size={size} className={className} />;
    }
    
    return <IconComponent size={size} className={className} />;
};

ObjectTypeIcon.displayName = 'ObjectTypeIcon';
