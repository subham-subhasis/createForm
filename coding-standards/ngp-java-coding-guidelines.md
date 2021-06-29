## Java Coding Standards

**Package and Import Statements**

>The first non-comment line of most Java source files is a package statement. After that, import statements can follow. For example:
>- package java.awt;
>-  import java.awt.peer.CanvasPeer; 

**Indentation**

>Four spaces should be used as the unit of indentation.

**Line Length**

>Avoid lines longer than 80 characters.

**Wrapping Lines**

>When an expression will not fit on a single line, break it according to these general principles:
> - Break after a comma.
> - Break before an operator.
> - Prefer higher-level breaks to lower-level breaks.
> - Align the new line with the beginning of the expression at the same level on the previous line.

**Naming Conventions**

> Packages
> - com.sun.eng
> - com.apple.quicktime.v2
> - edu.cmu.cs.bovik.cheese

> Classes
> - class Raster
> - class ImageSprite

> Interfaces
> - interface RasterDelegate
> - interface Storing

> Methods
> - run()
> - runFast()
> - getBackground()

> Variables
> - int index;
> - char name;
> - float widthInCm;

> Constants:
> - static final int MIN_WIDTH = 4;
> - static final int MAX_WIDTH = 999;
> - static final int GET_THE_CPU = 1;

**Strings**
> Strings are Immutable
> **//Avoid**
> String name = "testing";
> name = name + "abc";
>
> **// Prefer**
> String name = "testing";
> StringBuffer stringBuffer = new StringBuffer(name);
> stringBuffer.append("abc");
> str = stringBuffer.toString();
