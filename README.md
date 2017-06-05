# Markdown Graphics
A Markdown extension, in the form of a web-based editor, that enables users to create both text and graphics for the web, in a single platform.

## Description
Currently, off-the-shelf Markdown editors support plain text editing only. Markdown Graphics enables users to create and edit graphics right at the location where they are inserted, which provides a much more cohesive composing experience for creating content for the web. In addition, Markdown Graphics supports diagram component tagging, allowing diagram and text to be styled by a single stylesheet. Also, diagrams created and stored in SVG will be web-publishing-friendly and light-weight. Thus, content creators, journalists and notetakers can communicate ideas on the web much more efficiently.

[Demo video](https://vimeo.com/93328576)

## Objectives
- To simplify the process of making diagrams in a textual context. Or in other words, to kill the following sequence, also the way I attach this image here.
![sequenceToKill](http://xinranwang.github.io/markdown.graphics/sequence.png)
- To separate *[form and content](http://en.wikipedia.org/wiki/Form_and_content)* of images, allowing CSS to take over all the styling.  

> In the twenty-first century, form and content are being pulled back apart. Style sheets, for example, compel designers to think globally and systematically instead of focusing on the fixed construction of a particular surface. This way of thinking allows content to be reformatted for different devices or users, and it also prepares for the afterlife of data as electronic storage media begin their own cycles of decay and obsolescence.
> – Ellen Lupton, Thinking with Type

- To set a new standard of making images for the web.

## Current functions
- Users type `<svg>` to trigger canvas.
- Two shape tags(classes): *regular* and *highlight*.
- When users finishes drawing, the content is centered and extra space is trimmed.
- Snapping grid to help users make better shapes.
- Click the diagram to edit again. Content is placed in the center of the canvas.

## Libraries Used
- JQuery
- [D3.js](http://d3js.org/) for generating SVGs(without using the *data* part).
- [CodeMirror](http://codemirror.net/) for the text editor.

## Expected functions
- More stencils (including but not limited to..)
    - [ ] Labels
    - [x] Arrows
    - [ ] Freehand Drawings
    - [ ] Polygons
- Vector Editing
- Importing SVGs
- More component tags
- Save sessions
- Preview
- Publish to [Jekyll](http://jekyllrb.com/) sites
- Export and preview as .mdg file format
- Support more markup languages(Asciidoc, Textile, etc.)
