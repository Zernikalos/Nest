import React from 'react'
import { useFileImport } from '../providers/FileImportProvider'

// Ejemplo de cómo usar el hook en cualquier componente
export function ExampleUsage() {
    const { workflowState, isImporting } = useFileImport()
    
    return (
        <div className="example-usage">
            <h3>File Import Status</h3>
            
            <div className="status-info">
                <p>Current Step: {workflowState.currentStep}</p>
                <p>Is Importing: {isImporting ? 'Yes' : 'No'}</p>
                
                {workflowState.parsedData && (
                    <div className="parsed-data">
                        <h4>Parsed Data Available</h4>
                        <p>File has been successfully processed!</p>
                        {/* Aquí puedes mostrar los datos parseados */}
                    </div>
                )}
            </div>
        </div>
    )
}

// Ejemplo de componente que exporta datos
export function ExportButton() {
    const { workflowState } = useFileImport()
    
    const handleExport = async () => {
        if (workflowState.parsedData) {
            try {
                await workflowState.exportCurrent()
                console.log('Export completed!')
            } catch (error) {
                console.error('Export failed:', error)
            }
        }
    }
    
    return (
        <button 
            onClick={handleExport}
            disabled={!workflowState.parsedData}
            className="export-button"
        >
            Export Scene
        </button>
    )
} 