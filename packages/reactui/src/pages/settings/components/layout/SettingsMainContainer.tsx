import type { ReactNode } from "react"
import { useState } from "react"
import { useForm, FormProvider, type FieldValues, type SubmitHandler, type DefaultValues } from "react-hook-form"
import { Button } from "@/components/ui/button"

type SettingsMainContainerProps<T extends FieldValues> = {
    title: string
    description: string
    children: ReactNode
    defaultValues: DefaultValues<T>
    onSubmit: SubmitHandler<T>
}

/**
 * Main container component for settings pages.
 * Provides consistent layout with title, description, and content area.
 * Now includes form functionality with FormProvider and submit button.
 * Designed to contain multiple SettingsSectionItem components.
 * The save button is positioned at the bottom and remains visible during scrolling.
 */
export function SettingsMainContainer<T extends FieldValues>({ 
    title, 
    description, 
    children, 
    defaultValues,
    onSubmit
}: SettingsMainContainerProps<T>) {
    const [isSaved, setIsSaved] = useState(false)
    const form = useForm<T>({
        defaultValues
    })

    const handleSubmit = (data: T) => {
        onSubmit(data)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 1500)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col flex-1">
                <div 
                    className="flex-1 overflow-y-auto space-y-6"
                    data-component="settings-main-container"
                >
                    <div data-component="settings-header">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <p className="text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div 
                        className="space-y-6"
                        data-component="settings-content"
                    >
                        {children}
                    </div>
                </div>

                {/* Sticky Submit Button at bottom */}
                <div className="sticky bottom-0 bg-base-100 border-t mt-6">
                    <div className="flex justify-end p-4">
                        <Button 
                            type="submit"
                            className="px-6 w-[100px]"
                            variant={isSaved ? "success" : "default"}
                        >
                            {isSaved ? "Saved ✓" : "Save"}
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

SettingsMainContainer.displayName = "SettingsMainContainer"
