type Props = React.ComponentProps<"input"> & {
    legenda?: string 
}

export function Input({ legenda, type = "text", ...corpo}: Props) {
    return (
        <fieldset className="flex flex-1 max-h-20 focus-within:text-indigo-400">
            {legenda && 
                <legend className="uppercase text-2xl mb-2 text-inherit">{legenda}</legend>}

            <input  type={type} 
            className="w-full h-12 rounded-lg border border-grey-200 px-4 
            text-sm text-gray-100 bg-transparent outline-none focus:border-2
             focus:border-indigo-400 placeholder-indigo-300" {...corpo} />
        </fieldset>
    )
}