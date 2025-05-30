type Props = React.ComponentProps<"select"> & {
    legenda?: string
}

export function Select({ legenda, children, ...corpo }: Props) {
    return (
        <fieldset className="flex flex-1 max-h-20 focus-within:text-indigo-400">
            {legenda &&
                <legend className="uppercase text-2xl mb-2 text-inherit">{legenda}</legend>}

            <select
                className="w-full h-12 rounded-lg border border-grey-200 px-4
                text-sm text-gray-100 bg-transparent outline-none focus:border-2
                focus:border-indigo-400 placeholder-indigo-300"
                value=""
                {...corpo}
            >

                <option value="" disabled hidden>
                    Selecione
                </option>

                {children}
            </select>
        </fieldset>
    )
}