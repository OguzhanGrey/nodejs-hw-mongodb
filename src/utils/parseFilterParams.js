const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseFavourite = (fav) => {
  if (typeof fav === 'boolean') return fav;

  if (typeof fav === 'string') {
    const lower = fav.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }

  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseType(contactType);
  const parsedFavourite = parseFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedFavourite,
  };
};
