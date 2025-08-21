import type { ReactNode } from "react"
import { useForm, FormProvider, type UseFormReturn, type FieldValues, type SubmitHandler, type DefaultValues } from "react-hook-form"
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
 */
export function SettingsMainContainer<T extends FieldValues>({ 
    title, 
    description, 
    children, 
    defaultValues,
    onSubmit
}: SettingsMainContainerProps<T>) {
    const form = useForm<T>({
        defaultValues
    })

    const handleSubmit = (data: T) => {
        onSubmit(data)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div 
                    className="space-y-6"
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

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t">
                        <Button 
                            type="submit"
                            className="px-6"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

SettingsMainContainer.displayName = "SettingsMainContainer"
