import clsx from 'clsx'

type Props = React.ComponentProps<"button"> & {
    carregando?: boolean
}

export function Button({
    children,
    carregando,
    type = "button",
    ...corpo
}: Props) {
    return (
        <button
            type={type}
            disabled={carregando}
            className={clsx(
                "flex items-center justify-center rounded-lg",
                "bg-indigo-700 text-white hover:bg-indigo-400 transition ease-linear",
                "disabled:opacity-50 disabled:cursor-progress",
                "px-6 py-3 text-base cursor-pointer"
            )}
            {...corpo}
        >
            {children}
        </button>
    );
}
