import React from 'react'
import { useFileImport } from '../providers/FileImportProvider'

export function FileImportIndicators() {
    const { isImporting, importError, currentFile, workflowState } = useFileImport()
    
    return (
        <>
            {/* Loading overlay */}
            {isImporting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <div>
                                <p className="font-medium">Importing file...</p>
                                {currentFile && (
                                    <p className="text-sm text-gray-600">{currentFile.fileName}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Error toast */}
            {importError && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <div className="flex items-center space-x-2">
                        <span className="text-red-200">⚠️</span>
                        <span>Import Error: {importError}</span>
                    </div>
                </div>
            )}
            
            {/* Success toast */}
            {workflowState.parsedData && workflowState.currentStep === "completed" && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-200">✅</span>
                        <span>File imported successfully!</span>
                    </div>
                </div>
            )}
        </>
    )
} 