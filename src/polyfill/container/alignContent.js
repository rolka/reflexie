Flexbox.models.alignContent = function (alignment, properties, model) {
	var values = this.values,
		container = values.container,

		crossStart = this.crossStart,
		crossSize = this.crossSize,

		containerSize = container[crossSize],
		isStart = (alignment === "flex-start"),
		isCenter = (alignment === "center"),
		isBetween = (alignment === "space-between"),
		isAround = (alignment === "space-around"),

		isStretch = (properties["align-content"] === "stretch"),
		timeToStretch = (model === "alignContentStretch"),

		isNotFlexWrap = (properties["flex-wrap"] === "nowrap"),
		lines = this.lines,
		i, j, k, l, line, item,
		lineRemainder, currentLineRemainder,
		multiplier = 1, halfLineRemainder,

		crossTotal = crossStart + "Total",

		reverser = this.reverser,

		lineLength = lines.length,
		startIndex = 0;

	// http://www.w3.org/TR/css3-flexbox/#align-content-property
	//  Note, this property has no effect when the flexbox has only a single line.
	if (isNotFlexWrap && lines.length <= 1) {
		return;
	}

	lineRemainder = containerSize;

	if (isStart || (isStretch && !timeToStretch) || (!isStretch && timeToStretch)) {
		return;
	}

	for (i = 0, j = lineLength; i < j; i++) {
		currentLineRemainder = 0;
		line = lines[i].items;

		for (k = 0, l = line.length; k < l; k++) {
			item = line[k];
			currentLineRemainder = Math.max(currentLineRemainder, (item[crossSize] + item.debug.inner[crossStart]) + item.debug.margin[crossTotal]);
		}

		lineRemainder -= currentLineRemainder;
	}

	// This will differ between content alignments
	// Watch for this
	startIndex = 0;

	// The current line remainder
	currentLineRemainder = 0;

	if ((isBetween || isAround || isStretch) && lineRemainder <= 0) {
		if (isAround) {
			isAround = false;
			isCenter = true;
		} else {
			return;
		}
	}

	if (isCenter) {
		multiplier = 0.5;
	}

	if (isBetween || isAround || isStretch) {
		startIndex = 1;

		lineRemainder /= (lineLength - (!isBetween ? 0 : 1));
		currentLineRemainder = lineRemainder;

		if (isAround) {
			halfLineRemainder = (lineRemainder * 0.5);

			line = lines[0];

			for (k = 0, l = line.items.length; k < l; k++) {
				item = line.items[k];
				item[crossStart] += halfLineRemainder * reverser;
			}

			lineRemainder += halfLineRemainder;
		}
	}

	for (j = lineLength; startIndex < j; startIndex++) {
		line = lines[startIndex];

		for (k = 0, l = line.items.length; k < l; k++) {
			item = line.items[k];
			item[crossStart] += (lineRemainder * multiplier) * reverser;
		}

		lineRemainder += currentLineRemainder;
	}
};
