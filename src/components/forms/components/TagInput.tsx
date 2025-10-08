import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    className?: string
    maxTags?: number
    suggestions?: string[]
}

export function TagInput({ 
    tags, 
    onChange, 
    placeholder = "Add tags...", 
    className,
    maxTags,
    suggestions = []
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const filteredSuggestions = suggestions.filter(
        suggestion => 
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(suggestion)
    )

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim()
        if (trimmedTag && !tags.includes(trimmedTag) && (!maxTags || tags.length < maxTags)) {
            onChange([...tags, trimmedTag])
            setInputValue('')
            setShowSuggestions(false)
        }
    }

    const removeTag = (indexToRemove: number) => {
        onChange(tags.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag(inputValue)
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1)
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    const handleInputChange = (value: string) => {
        setInputValue(value)
        setShowSuggestions(Boolean(value.length > 0 && filteredSuggestions.length > 0))
    }

    return (
        <div className={cn("space-y-2", className)}>
            {/* Tags Display */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge 
                            key={index} 
                            variant="secondary" 
                            className="pl-3 pr-1 py-1 text-xs flex items-center gap-1"
                        >
                            <span>{tag}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeTag(index)}
                                type="button"
                            >
                                <X size={12} />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="relative">
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={maxTags && tags.length >= maxTags ? `Maximum ${maxTags} tags reached` : placeholder}
                        disabled={Boolean(maxTags && tags.length >= maxTags)}
                        onFocus={() => setShowSuggestions(Boolean(inputValue.length > 0 && filteredSuggestions.length > 0))}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {inputValue && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => addTag(inputValue)}
                            className="px-3"
                        >
                            <Plus size={14} />
                        </Button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md max-h-32 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                                onClick={() => addTag(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground">
                {maxTags ? `${tags.length}/${maxTags} tags` : `${tags.length} tags`}
                {tags.length === 0 && " • Press Enter to add tags"}
            </p>
        </div>
    )
}

// Common tag suggestions for different domains
export const TAG_SUGGESTIONS = {
    businessCapability: [
        'customer-facing', 'internal', 'core-process', 'support-process', 
        'digital', 'manual', 'automated', 'strategic', 'operational',
        'revenue-generating', 'cost-center', 'regulatory', 'compliance'
    ],
    technology: [
        'legacy', 'modern', 'cloud-native', 'on-premise', 'saas', 'paas', 'iaas',
        'microservices', 'monolith', 'api', 'database', 'security', 'integration',
        'mobile', 'web', 'desktop', 'real-time', 'batch', 'analytics'
    ],
    process: [
        'manual', 'automated', 'semi-automated', 'critical', 'standard',
        'exception', 'customer-facing', 'back-office', 'real-time', 'batch',
        'approval-required', 'self-service', 'regulated', 'audited'
    ],
    interface: [
        'api', 'ui', 'batch', 'real-time', 'synchronous', 'asynchronous',
        'rest', 'soap', 'graphql', 'websocket', 'file-transfer', 'database',
        'message-queue', 'event-driven', 'request-response'
    ]
}