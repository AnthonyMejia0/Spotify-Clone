function Artist({ name, img, id }) {
  return (
    <div className="flex flex-col min-w-[10rem] md:min-w-[13rem] hover:bg-slate-800 items-center justify-center rounded-md cursor-pointer p-4">
        <img className="h-32 w-32 md:h-44 md:w-44 rounded-full mb-2" src={img} />
        <p className="font-bold text-md">{name}</p>
        <p className="text-sm">Artist</p>
    </div>
  )
}

export default Artist