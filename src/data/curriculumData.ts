import { Chapter, FormulaItem, GradeLevel, QuizQuestion, Subject, DoubtFAQ } from "../types/index.ts";

export const SUBJECTS: Record<GradeLevel, Subject[]> = {
  class10: [
    {
      id: "math",
      name: "Mathematics",
      tagline: "Class 10 CBSE Board & NCERT Mastery",
      chaptersCount: 14,
      grade: "class10",
      iconName: "Calculator",
      accentColor: "#38BDF8",
      overview: "Complete mastery of all 14 Class 10 NCERT chapters: Real Numbers, Polynomials, Linear Equations, Quadratics, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry, Circles, Surface Areas, Statistics, and Probability.",
    },
  ],
  class9: [
    {
      id: "math",
      name: "Mathematics",
      tagline: "Class 9 Foundational & Axiomatic Rigor",
      chaptersCount: 11,
      grade: "class9",
      iconName: "Calculator",
      accentColor: "#38BDF8",
      overview: "Complete mastery of all 11 Class 9 NCERT chapters: Number Systems, Polynomials, Coordinate Geometry, Linear Equations, Lines & Angles, Triangles, Quadrilaterals, Circles, Heron’s Formula, Surface Areas, and Statistics.",
    },
  ],
};

export const CHAPTERS_DATA: Chapter[] = [
  {
    "id": "c10-math-ch1",
    "subjectId": "math",
    "grade": "class10",
    "number": 1,
    "title": "Real Numbers",
    "subtopics": [
      "Fundamental Theorem of Arithmetic",
      "Prime Factorisation for HCF and LCM",
      "Revisiting Irrational Numbers (Proof by Contradiction)"
    ],
    "keyConcepts": [
      "Fundamental Theorem of Arithmetic: Every composite number can be expressed as a unique product of primes, apart from the order of factors.",
      "Relationship: HCF(a, b) × LCM(a, b) = a × b (valid strictly for two numbers).",
      "Irrationality proof: Assume √2 = p/q in lowest coprimes; squaring yields p² = 2q² => p is divisible by 2. Substituting p = 2k gives q² = 2k² => q is divisible by 2. Contradicts that p and q are coprime.",
      "Sum or difference of rational and irrational is always irrational."
    ],
    "examWeightage": "6 Marks",
    "formulaHighlight": "HCF(a, b) × LCM(a, b) = a × b  ·  √p is irrational (for prime p)",
    "summary": "Real numbers comprise rational and irrational sets. The fundamental theorem of arithmetic guarantees unique prime factor factorization essential for finding greatest common divisors and least common multiples.",
    "tips": [
      "Proofs of √3 or √5 irrationality appear regularly in Section B/C (3 marks). Write each step of the contradiction method clearly."
    ],
    "pyqSample": {
      "question": "Prove that 3 + 2√5 is an irrational number, given that √5 is irrational.",
      "marks": 3,
      "answer": "Let 3 + 2√5 be rational = a/b where a, b are coprimes (b ≠ 0). 2√5 = a/b - 3 = (a - 3b)/b => √5 = (a - 3b)/(2b). Since a and b are integers, (a - 3b)/(2b) is rational, which implies √5 is rational. But this contradicts the given fact that √5 is irrational. Hence, 3 + 2√5 is irrational.",
      "year": "CBSE 2024, 2020"
    }
  },
  {
    "id": "c10-math-ch2",
    "subjectId": "math",
    "grade": "class10",
    "number": 2,
    "title": "Polynomials",
    "subtopics": [
      "Geometrical Meaning of Zeroes",
      "Relationship between Zeroes and Coefficients of Quadratic Polynomial",
      "Formation of Quadratic Polynomials"
    ],
    "keyConcepts": [
      "Number of zeroes of p(x) equals the number of points where the graph y = p(x) intersects the X-axis.",
      "For quadratic polynomial p(x) = ax² + bx + c with zeroes α and β:",
      "Sum of zeroes: α + β = -b / a = -(coefficient of x) / (coefficient of x²).",
      "Product of zeroes: α · β = c / a = (constant term) / (coefficient of x²).",
      "Forming polynomial from zeroes: k [ x² - (α + β)x + αβ ]."
    ],
    "examWeightage": "4 to 5 Marks",
    "formulaHighlight": "α + β = -b/a  ·  α·β = c/a  ·  p(x) = k[x² - (α+β)x + αβ]",
    "summary": "Zeroes of a polynomial represent coordinate roots where polynomial value evaluates to zero. In quadratics, coefficients strictly govern root symmetry and parabolic vertex coordinates.",
    "tips": [
      "Frequently used identity: α² + β² = (α + β)² - 2αβ.",
      "1/α + 1/β = (α + β) / (αβ)."
    ],
    "pyqSample": {
      "question": "If α and β are the zeroes of the quadratic polynomial f(x) = x² - 5x + k such that α - β = 1, find the value of k.",
      "marks": 3,
      "answer": "α + β = -(-5)/1 = 5, αβ = k. (α - β)² = (α + β)² - 4αβ => (1)² = (5)² - 4k => 1 = 25 - 4k => 4k = 24 => k = 6.",
      "year": "CBSE 2023"
    }
  },
  {
    "id": "c10-math-ch3",
    "subjectId": "math",
    "grade": "class10",
    "number": 3,
    "title": "Pair of Linear Equations in Two Variables",
    "subtopics": [
      "Graphical Representation & Consistency",
      "Substitution Method",
      "Elimination Method",
      "Word Problems: Age, Speed & Fractions"
    ],
    "keyConcepts": [
      "System: a1·x + b1·y + c1 = 0 and a2·x + b2·y + c2 = 0.",
      "Intersecting Lines (Unique Solution / Consistent): a1/a2 ≠ b1/b2.",
      "Coincident Lines (Infinitely Many Solutions / Dependent Consistent): a1/a2 = b1/b2 = c1/c2.",
      "Parallel Lines (No Solution / Inconsistent): a1/a2 = b1/b2 ≠ c1/c2."
    ],
    "examWeightage": "6 to 8 Marks",
    "formulaHighlight": "a₁/a₂ ≠ b₁/b₂ (Unique)  ·  a₁/a₂ = b₁/b₂ = c₁/c₂ (Infinite)  ·  a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (No Sol)",
    "summary": "Linear equations model simultaneous conditions. Solving finds coordinate point (x, y) satisfying both linear geometries simultaneously.",
    "tips": [
      "In upstream/downstream problems: Speed upstream = (x - y) km/h, downstream = (x + y) km/h. Distance = Speed × Time."
    ],
    "pyqSample": {
      "question": "For which value of k will the following pair of linear equations have no solution? 3x + y = 1 and (2k - 1)x + (k - 1)y = 2k + 1.",
      "marks": 3,
      "answer": "For no solution: a1/a2 = b1/b2 ≠ c1/c2. 3/(2k - 1) = 1/(k - 1) ≠ 1/(2k + 1). 3(k - 1) = 2k - 1 => 3k - 3 = 2k - 1 => k = 2. Checking second condition: 1/(2 - 1) = 1 ≠ 1/(2(2) + 1) = 1/5. Valid. Hence k = 2.",
      "year": "CBSE 2024"
    }
  },
  {
    "id": "c10-math-ch4",
    "subjectId": "math",
    "grade": "class10",
    "number": 4,
    "title": "Quadratic Equations",
    "subtopics": [
      "Standard Form ax² + bx + c = 0",
      "Factoring by Middle-Term Splitting",
      "Quadratic Formula",
      "Nature of Roots & Discriminant"
    ],
    "keyConcepts": [
      "Standard Form: ax² + bx + c = 0 (a ≠ 0).",
      "Discriminant: D = b² - 4ac.",
      "Roots: x = (-b ± √D) / (2a).",
      "If D > 0: Two distinct real roots.",
      "If D = 0: Two equal real roots (x = -b / 2a).",
      "If D < 0: No real roots."
    ],
    "examWeightage": "6 to 8 Marks",
    "formulaHighlight": "x = (-b ± √(b² - 4ac)) / (2a)  ·  D = b² - 4ac",
    "summary": "Any equation of degree two is quadratic. Discriminant determines real root feasibility before algebraic factoring.",
    "tips": [
      "For equal roots problems, set D = 0 immediately and solve for unknown variable k."
    ],
    "pyqSample": {
      "question": "Find the nature of the roots of the quadratic equation 2x² - 4x + 3 = 0. If real roots exist, find them.",
      "marks": 2,
      "answer": "a = 2, b = -4, c = 3. D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.",
      "year": "CBSE 2023"
    }
  },
  {
    "id": "c10-math-ch5",
    "subjectId": "math",
    "grade": "class10",
    "number": 5,
    "title": "Arithmetic Progressions",
    "subtopics": [
      "Definition & General Term an",
      "Common Difference d",
      "Sum of First n Terms Sn",
      "Real-world Word Applications"
    ],
    "keyConcepts": [
      "AP sequence: a, a+d, a+2d, a+3d, ...",
      "n-th term: an = a + (n - 1)d.",
      "Common difference: d = aₖ - aₖ₋₁.",
      "Sum of n terms: Sn = (n / 2) [ 2a + (n - 1)d ] = (n / 2) [ a + l ], where l = an.",
      "n-th term from end = l - (n - 1)d.",
      "an = Sn - Sₙ₋₁."
    ],
    "examWeightage": "5 to 7 Marks",
    "formulaHighlight": "aₙ = a + (n - 1)d  ·  Sₙ = n/2 · [2a + (n - 1)d] = n/2 · (a + l)",
    "summary": "An arithmetic progression features a constant numerical difference between consecutive terms. Useful for calculating accumulated savings, depreciation, and linear series.",
    "tips": [
      "Three numbers in AP can be conveniently assumed as (a - d), a, (a + d).",
      "Four numbers in AP can be assumed as (a - 3d), (a - d), (a + d), (a + 3d)."
    ],
    "pyqSample": {
      "question": "How many terms of the AP 24, 21, 18, ... must be taken so that their sum is 78?",
      "marks": 3,
      "answer": "a = 24, d = 21 - 24 = -3. Sn = 78. (n/2)[2(24) + (n - 1)(-3)] = 78 => n[48 - 3n + 3] = 156 => 51n - 3n² = 156 => 3n² - 51n + 156 = 0 => n² - 17n + 52 = 0 => (n - 4)(n - 13) = 0 => n = 4 or n = 13. (Both values valid because terms from 5th to 13th add up to zero).",
      "year": "CBSE 2024, 2020"
    }
  },
  {
    "id": "c10-math-ch6",
    "subjectId": "math",
    "grade": "class10",
    "number": 6,
    "title": "Triangles",
    "subtopics": [
      "Similarity of Triangles",
      "Basic Proportionality Theorem (Thales) & Converse",
      "Criteria for Similarity: AAA, SSS, SAS"
    ],
    "keyConcepts": [
      "Two polygons are similar if corresponding angles are equal and corresponding sides are in the same ratio.",
      "BPT (Thales Theorem): If a line is drawn parallel to one side of a triangle intersecting the other two sides in distinct points, then it divides the two sides in the same ratio (AD/DB = AE/EC).",
      "Converse of BPT: If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side.",
      "Similarity Criteria: AAA (or AA), SSS, SAS."
    ],
    "examWeightage": "8 to 10 Marks",
    "formulaHighlight": "AD / DB = AE / EC (Basic Proportionality Theorem)",
    "summary": "Geometric similarity preserves shape while scaling size proportionally. Formal proofs of Thales theorem and angle-angle similarity form core board questions.",
    "tips": [
      "The formal theorem proof of BPT (Thales Theorem) with construction of altitudes is a recurring 5-mark question in CBSE board examinations."
    ],
    "pyqSample": {
      "question": "In △ABC, DE ∥ BC intersecting AB at D and AC at E. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, find EC.",
      "marks": 2,
      "answer": "By Basic Proportionality Theorem, AD/DB = AE/EC => 1.5/3 = 1/EC => 1/2 = 1/EC => EC = 2 cm.",
      "year": "CBSE 2023"
    }
  },
  {
    "id": "c10-math-ch7",
    "subjectId": "math",
    "grade": "class10",
    "number": 7,
    "title": "Coordinate Geometry",
    "subtopics": [
      "Distance Formula",
      "Section Formula (Internal Division)",
      "Mid-point Formula"
    ],
    "keyConcepts": [
      "Distance between P(x1, y1) and Q(x2, y2): d = √[(x2 - x1)² + (y2 - y1)²].",
      "Distance of point P(x, y) from origin O(0, 0): OP = √(x² + y²).",
      "Section Formula: Point P(x, y) dividing line joining A(x1, y1) and B(x2, y2) in ratio m1 : m2:",
      "x = (m1·x2 + m2·x1) / (m1 + m2), y = (m1·y2 + m2·y1) / (m1 + m2).",
      "Midpoint Formula: M = ( (x1 + x2)/2 , (y1 + y2)/2 ).",
      "Centroid of triangle: G = ( (x1 + x2 + x3)/3 , (y1 + y2 + y3)/3 )."
    ],
    "examWeightage": "6 Marks",
    "formulaHighlight": "d = √[(x₂ - x₁)² + (y₂ - y₁)²]  ·  P(x, y) = ((m₁x₂ + m₂x₁)/(m₁+m₂), (m₁y₂ + m₂y₁)/(m₁+m₂))",
    "summary": "Coordinate geometry unites algebra and Euclidean geometry on a 2D Cartesian plane, allowing numerical analysis of geometric distances, collinearity, and segment divisions.",
    "tips": [
      "When ratio is unknown, always assume ratio to be k : 1 for faster single-variable algebraic solution.",
      "Point on X-axis has coordinates (x, 0); Point on Y-axis has coordinates (0, y)."
    ],
    "pyqSample": {
      "question": "Find the ratio in which the Y-axis divides the line segment joining the points (5, -6) and (-1, -4). Also find the point of intersection.",
      "marks": 3,
      "answer": "Let ratio be k : 1. Point on Y-axis has x = 0. By section formula: x = [k(-1) + 1(5)] / (k + 1) = 0 => -k + 5 = 0 => k = 5. Ratio is 5 : 1. For y-coordinate: y = [5(-4) + 1(-6)] / (5 + 1) = (-20 - 6)/6 = -26/6 = -13/3. Point is (0, -13/3).",
      "year": "CBSE 2024, 2021"
    }
  },
  {
    "id": "c10-math-ch8",
    "subjectId": "math",
    "grade": "class10",
    "number": 8,
    "title": "Introduction to Trigonometry",
    "subtopics": [
      "Trigonometric Ratios in Right Triangle",
      "Values at 0°, 30°, 45°, 60°, 90°",
      "Fundamental Pythagorean Trigonometric Identities"
    ],
    "keyConcepts": [
      "In right △ABC (right angled at B): sin θ = Opp/Hyp, cos θ = Adj/Hyp, tan θ = Opp/Adj.",
      "cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.",
      "Key table: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, sin 90° = 1.",
      "tan 30° = 1/√3, tan 45° = 1, tan 60° = √3.",
      "Identity 1: sin² θ + cos² θ = 1.",
      "Identity 2: 1 + tan² θ = sec² θ (or sec² θ - tan² θ = 1).",
      "Identity 3: 1 + cot² θ = cosec² θ (or cosec² θ - cot² θ = 1)."
    ],
    "examWeightage": "8 to 10 Marks",
    "formulaHighlight": "sin²θ + cos²θ = 1  ·  sec²θ - tan²θ = 1  ·  csc²θ - cot²θ = 1",
    "summary": "Trigonometry formalizes side-to-angle proportions in right triangles, creating foundational algebraic tools for analytical geometry, mechanics, and wave physics.",
    "tips": [
      "When verifying LHS = RHS proofs, expressing all terms in terms of sin θ and cos θ is a reliable guaranteed approach."
    ],
    "pyqSample": {
      "question": "Prove that (1 + cot² θ) · (1 - cos θ) · (1 + cos θ) = 1.",
      "marks": 2,
      "answer": "LHS = (1 + cot² θ) · [1 - cos² θ]. We know 1 + cot² θ = cosec² θ and 1 - cos² θ = sin² θ. LHS = cosec² θ · sin² θ = (1/sin² θ) · sin² θ = 1 = RHS. Hence proved.",
      "year": "CBSE 2023"
    }
  },
  {
    "id": "c10-math-ch9",
    "subjectId": "math",
    "grade": "class10",
    "number": 9,
    "title": "Some Applications of Trigonometry",
    "subtopics": [
      "Line of Sight & Angle of Elevation",
      "Angle of Depression",
      "Solving Real-world Heights & Distances Problems"
    ],
    "keyConcepts": [
      "Angle of Elevation: Angle formed by the line of sight with the horizontal when object is above observer level.",
      "Angle of Depression: Angle formed by the line of sight with the horizontal when object is below observer level.",
      "Angle of depression equals angle of alternate interior elevation.",
      "Most problems resolve into right-angled triangles using tan θ = height / base."
    ],
    "examWeightage": "4 to 6 Marks",
    "formulaHighlight": "tan θ = Opposite (Height) / Adjacent (Distance)  ·  sin θ = Height / Hypotenuse",
    "summary": "Applied trigonometry calculates inaccessible physical heights and distances (e.g. towers, lighthouses, river widths) using line-of-sight angular elevation measurements.",
    "tips": [
      "Always draw a neat, labeled right-triangle diagram with horizontal reference line before setting up tangent equations."
    ],
    "pyqSample": {
      "question": "A ladder leaning against a wall makes an angle of 60° with the horizontal. If the foot of the ladder is 2.5 m away from the wall, find the length of the ladder.",
      "marks": 2,
      "answer": "Let length of ladder be L (hypotenuse), base = 2.5 m. cos 60° = Base / Hypotenuse => 1/2 = 2.5 / L => L = 2.5 × 2 = 5 m.",
      "year": "CBSE 2023, 2019"
    }
  },
  {
    "id": "c10-math-ch10",
    "subjectId": "math",
    "grade": "class10",
    "number": 10,
    "title": "Circles",
    "subtopics": [
      "Tangent to a Circle & Point of Contact",
      "Theorem 10.1: Tangent is perpendicular to radius at point of contact",
      "Theorem 10.2: Tangents drawn from an external point to a circle are equal in length"
    ],
    "keyConcepts": [
      "A tangent to a circle is a straight line that touches the circle at exactly one point.",
      "Theorem 10.1: The tangent at any point of a circle is perpendicular to the radius through the point of contact (OP ⊥ AB).",
      "There is no tangent from an interior point; exactly 1 tangent at a point on the circle; exactly 2 tangents from an exterior point.",
      "Theorem 10.2: The lengths of tangents drawn from an external point to a circle are equal (PA = PB).",
      "The tangents subtend equal angles at the center and are equally inclined to the line joining point to center."
    ],
    "examWeightage": "6 Marks",
    "formulaHighlight": "PA = PB (Tangents from external point)  ·  OP ⊥ PT (Radius ⊥ Tangent)",
    "summary": "Circle tangents possess unique geometric symmetry. Tangents drawn from external points create congruent right triangles through radii perpendicularity.",
    "tips": [
      "Theorem 10.2 proof (PA = PB using RHS congruency of △OAP and △OBP) is a frequent board exam question."
    ],
    "pyqSample": {
      "question": "Prove that the tangents drawn at the ends of a diameter of a circle are parallel.",
      "marks": 2,
      "answer": "Let AB be diameter. Tangents PQ at A and RS at B are perpendicular to diameter AB (radius ⊥ tangent). Thus ∠PAB = 90° and ∠ABS = 90°. Since alternate interior angles are equal (∠PAB = ∠ABS = 90°), PQ ∥ RS. Hence proved.",
      "year": "CBSE 2024, 2020"
    }
  },
  {
    "id": "c10-math-ch11",
    "subjectId": "math",
    "grade": "class10",
    "number": 11,
    "title": "Areas Related to Circles",
    "subtopics": [
      "Perimeter & Area of Circle Review",
      "Area of Sector of Angle θ",
      "Area of Segment of Circle",
      "Length of an Arc of a Sector"
    ],
    "keyConcepts": [
      "Circumference = 2πr, Area = πr².",
      "Length of arc of sector with angle θ: l = (θ / 360°) × 2πr.",
      "Area of sector with angle θ: Area = (θ / 360°) × πr².",
      "Area of minor segment = Area of corresponding minor sector - Area of corresponding triangle.",
      "Area of △OAB with central angle θ: (1/2) r² sin θ.",
      "Area of major sector = πr² - Area of minor sector."
    ],
    "examWeightage": "4 to 5 Marks",
    "formulaHighlight": "Area_sector = (θ / 360) · πr²  ·  Arc_length = (θ / 360) · 2πr",
    "summary": "Geometric partitioning of circular discs into sectors and segments using fractional degree ratios of $360^circ$.",
    "tips": [
      "Unless stated as 3.14, use π = 22/7 in all board calculations."
    ],
    "pyqSample": {
      "question": "Find the area of a sector of a circle of radius 6 cm if angle of the sector is 60° (use π = 22/7).",
      "marks": 2,
      "answer": "Area = (θ / 360°) × πr² = (60/360) × (22/7) × (6)² = (1/6) × (22/7) × 36 = 132/7 = 18.86 cm².",
      "year": "CBSE 2023"
    }
  },
  {
    "id": "c10-math-ch12",
    "subjectId": "math",
    "grade": "class10",
    "number": 12,
    "title": "Surface Areas and Volumes",
    "subtopics": [
      "Surface Area of Combinations of Solids",
      "Volume of Combinations of Solids",
      "Cylinder, Cone, Sphere, Hemisphere, Cuboid"
    ],
    "keyConcepts": [
      "Total surface area of combined solid equals sum of exposed curved surfaces (do NOT add internal joined surfaces!).",
      "Total volume of combined solid is always the direct arithmetic sum of individual component volumes.",
      "Cylinder: CSA = 2πrh, TSA = 2πr(r + h), Volume = πr²h.",
      "Cone: Slant height l = √(r² + h²), CSA = πrl, TSA = πr(l + r), Volume = (1/3)πr²h.",
      "Sphere: Surface Area = 4πr², Volume = (4/3)πr³.",
      "Hemisphere: CSA = 2πr², TSA = 3πr², Volume = (2/3)πr³."
    ],
    "examWeightage": "6 to 8 Marks",
    "formulaHighlight": "Cone l = √(r² + h²)  ·  Vol_cone = ⅓πr²h  ·  Vol_sphere = ⁴⁄₃πr³",
    "summary": "Calculates physical boundary envelopes and enclosed space for complex solid configurations like ice-cream cones, capsules, and cylindrical silos with hemispherical domes.",
    "tips": [
      "Be alert: When a cone sits on a hemisphere, TSA = CSA of cone + CSA of hemisphere. The flat circular bases touch inside and are not exposed."
    ],
    "pyqSample": {
      "question": "A solid is in the shape of a cone standing on a hemisphere with both their radii being equal to 1 cm and the height of the cone is equal to its radius. Find the volume of the solid in terms of π.",
      "marks": 3,
      "answer": "r = 1 cm, h = 1 cm. Total Volume = Volume of cone + Volume of hemisphere = (1/3)πr²h + (2/3)πr³ = (1/3)π(1)²(1) + (2/3)π(1)³ = (1/3)π + (2/3)π = π cm³.",
      "year": "CBSE 2022"
    }
  },
  {
    "id": "c10-math-ch13",
    "subjectId": "math",
    "grade": "class10",
    "number": 13,
    "title": "Statistics",
    "subtopics": [
      "Mean of Grouped Data (Direct & Assumed Mean Method)",
      "Mode of Grouped Data",
      "Median of Grouped Data",
      "Empirical Relationship between Mean, Median & Mode"
    ],
    "keyConcepts": [
      "Direct Mean: x̄ = Σ(fi·xi) / Σfi.",
      "Assumed Mean: x̄ = a + [ Σ(fi·di) / Σfi ], where di = xi - a.",
      "Mode: l + [ (f1 - f0) / (2f1 - f0 - f2) ] × h, where l = lower limit of modal class (class with highest frequency f1).",
      "Median: l + [ (n/2 - cf) / f ] × h, where cf = cumulative frequency of preceding class.",
      "Empirical Formula: 3 Median = Mode + 2 Mean."
    ],
    "examWeightage": "6 to 8 Marks",
    "formulaHighlight": "3 Median = Mode + 2 Mean  ·  Mode = l + [(f₁ - f₀)/(2f₁ - f₀ - f₂)]·h",
    "summary": "Statistics organizes quantitative sample data to extract representative central tendency measures (mean, median, and mode) for continuous distributions.",
    "tips": [
      "For finding median class, always calculate cumulative frequency (cf) column first and locate class containing n/2."
    ],
    "pyqSample": {
      "question": "The mode and mean of a frequency distribution are 29 and 26 respectively. Find the median of the distribution.",
      "marks": 2,
      "answer": "Empirical relationship: 3 Median = Mode + 2 Mean => 3 Median = 29 + 2(26) = 29 + 52 = 81 => Median = 81 / 3 = 27.",
      "year": "CBSE 2024"
    }
  },
  {
    "id": "c10-math-ch14",
    "subjectId": "math",
    "grade": "class10",
    "number": 14,
    "title": "Probability",
    "subtopics": [
      "Classical / Theoretical Definition of Probability",
      "Equally Likely Outcomes",
      "Elementary & Compound Events",
      "Impossible and Sure Events"
    ],
    "keyConcepts": [
      "Theoretical Probability: P(E) = Number of outcomes favorable to E / Total number of possible outcomes.",
      "Range: 0 ≤ P(E) ≤ 1. Impossible event P(E) = 0; Sure/Certain event P(E) = 1.",
      "Complementary Event: P(not E) = P(Ē) = 1 - P(E).",
      "Sum of probabilities of all elementary events of an experiment = 1.",
      "Playing Cards Deck: 52 cards = 26 Red (13 Hearts, 13 Diamonds) + 26 Black (13 Spades, 13 Clubs). 12 Face cards (4 Kings, 4 Queens, 4 Jacks)."
    ],
    "examWeightage": "4 to 5 Marks",
    "formulaHighlight": "P(E) = n(E) / n(S)  ·  P(E) + P(Ē) = 1  ·  0 ≤ P(E) ≤ 1",
    "summary": "Probability quantifies the likelihood of an outcome in random trials where exact deterministic prediction is impossible.",
    "tips": [
      "Probability can NEVER be negative or greater than 1.",
      "Aces are not considered face cards (only Kings, Queens, and Jacks are face cards)."
    ],
    "pyqSample": {
      "question": "One card is drawn from a well-shuffled deck of 52 cards. Find the probability of getting (i) a king of red colour and (ii) a face card.",
      "marks": 2,
      "answer": "(i) Number of red kings = 2 (Heart, Diamond). P(Red King) = 2/52 = 1/26. (ii) Total face cards = 12 (4 Kings + 4 Queens + 4 Jacks). P(Face Card) = 12/52 = 3/13.",
      "year": "CBSE 2023, 2020"
    }
  },
  {
    "id": "c9-math-ch1",
    "subjectId": "math",
    "grade": "class9",
    "number": 1,
    "title": "Number Systems",
    "subtopics": [
      "Rational & Irrational Numbers",
      "Real Numbers & Decimal Expansions",
      "Operations on Real Numbers",
      "Rationalising the Denominator",
      "Laws of Exponents for Real Numbers"
    ],
    "keyConcepts": [
      "Rational numbers (p/q, q ≠ 0) have terminating or non-terminating recurring decimal expansions.",
      "Irrational numbers have non-terminating non-recurring decimal expansions (e.g. √2, π, 0.1010010001...).",
      "Rationalising factor of (a + √b) is (a - √b) because (a + √b)(a - √b) = a² - b.",
      "Laws of Exponents: aᵐ · aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, aᵐ / aⁿ = aᵐ⁻ⁿ, aᵐ · bᵐ = (ab)ᵐ, a⁰ = 1."
    ],
    "examWeightage": "8 to 10 Marks",
    "formulaHighlight": "(√a + √b)(√a - √b) = a - b  ·  1/(a + √b) = (a - √b)/(a² - b)",
    "summary": "Real numbers bridge dense rationals and continuous irrationals on the infinite geometric number line.",
    "tips": [
      "To represent non-terminating repeating decimals (0.6̄ or 0.235̄) in p/q form, multiply by 10, 100, or 1000 according to recurring period."
    ],
    "pyqSample": {
      "question": "Rationalise the denominator of 1 / (7 + 3√2).",
      "marks": 2,
      "answer": "Multiply numerator and denominator by conjugate (7 - 3√2): [1(7 - 3√2)] / [(7 + 3√2)(7 - 3√2)] = (7 - 3√2) / [7² - (3√2)²] = (7 - 3√2) / (49 - 18) = (7 - 3√2) / 31.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch2",
    "subjectId": "math",
    "grade": "class9",
    "number": 2,
    "title": "Polynomials",
    "subtopics": [
      "Degree of Polynomials",
      "Zeroes of a Polynomial",
      "Factor Theorem",
      "Algebraic Identities Expansion & Factorisation"
    ],
    "keyConcepts": [
      "Degree: Highest exponent of variable in polynomial. Linear (1), Quadratic (2), Cubic (3).",
      "Factor Theorem: (x - a) is a factor of polynomial p(x) if p(a) = 0.",
      "(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx.",
      "(x + y)³ = x³ + y³ + 3xy(x + y).",
      "(x - y)³ = x³ - y³ - 3xy(x - y).",
      "x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx).",
      "High-Yield Shortcut: If x + y + z = 0, then x³ + y³ + z³ = 3xyz."
    ],
    "examWeightage": "10 to 12 Marks",
    "formulaHighlight": "x³ + y³ + z³ = 3xyz (when x + y + z = 0)  ·  Factor Theorem p(a) = 0",
    "summary": "Polynomial factorization uses synthetic substitution and expansion identities for cubic and multi-variable structures.",
    "tips": [
      "Whenever evaluated terms sum to zero, use the 3xyz identity rather than calculating giant cubes by hand."
    ],
    "pyqSample": {
      "question": "Evaluate without multiplying: (55)³ + (-25)³ + (-30)³.",
      "marks": 2,
      "answer": "Let x = 55, y = -25, z = -30. x + y + z = 55 - 25 - 30 = 0. Since x + y + z = 0, x³ + y³ + z³ = 3xyz = 3(55)(-25)(-30) = 3(55)(750) = 123,750.",
      "year": "Class 9 Exam, Exemplar"
    }
  },
  {
    "id": "c9-math-ch3",
    "subjectId": "math",
    "grade": "class9",
    "number": 3,
    "title": "Coordinate Geometry",
    "subtopics": [
      "Cartesian Plane: X-axis, Y-axis, Origin",
      "Quadrants I, II, III, IV",
      "Abscissa and Ordinate",
      "Plotting Points in the Plane"
    ],
    "keyConcepts": [
      "Cartesian plane formed by horizontal X-axis (x'Ox) and vertical Y-axis (y'Oy) intersecting at origin O(0, 0).",
      "Quadrant signs: I (+, +), II (-, +), III (-, -), IV (+, -).",
      "Abscissa: x-coordinate (perpendicular distance from Y-axis). Ordinate: y-coordinate (perpendicular distance from X-axis).",
      "Any point on X-axis has y = 0, denoted (x, 0). Any point on Y-axis has x = 0, denoted (0, y)."
    ],
    "examWeightage": "4 Marks",
    "formulaHighlight": "Quadrant I (+,+), II (-,+), III (-,-), IV (+,-)  ·  Origin = (0, 0)",
    "summary": "Coordinate indexing specifies unambiguous spatial positioning through perpendicular cartesian projections.",
    "tips": [
      "Do not confuse abscissa with ordinate: Abscissa is always the first x-coordinate, Ordinate is the second y-coordinate."
    ],
    "pyqSample": {
      "question": "Write the quadrant or axis on which the points lie: (i) (-3, 5), (ii) (4, 0), (iii) (-2, -5), (iv) (0, -7).",
      "marks": 2,
      "answer": "(i) (-3, 5) lies in Quadrant II. (ii) (4, 0) lies on positive X-axis. (iii) (-2, -5) lies in Quadrant III. (iv) (0, -7) lies on negative Y-axis.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch4",
    "subjectId": "math",
    "grade": "class9",
    "number": 4,
    "title": "Linear Equations in Two Variables",
    "subtopics": [
      "Standard Form ax + by + c = 0",
      "Solutions of a Linear Equation",
      "Graph of a Linear Equation in Two Variables",
      "Equations of Lines Parallel to X-axis and Y-axis"
    ],
    "keyConcepts": [
      "Standard form: ax + by + c = 0, where a, b, c are real numbers and a, b are not both zero.",
      "A linear equation in two variables has infinitely many pairs of solutions (x, y).",
      "The geometric graph of every linear equation in two variables is a straight line.",
      "Equation of X-axis is y = 0. Equation of a line parallel to X-axis is y = k.",
      "Equation of Y-axis is x = 0. Equation of a line parallel to Y-axis is x = k."
    ],
    "examWeightage": "6 Marks",
    "formulaHighlight": "ax + by + c = 0  ·  Line parallel to X-axis: y = k  ·  Line parallel to Y-axis: x = k",
    "summary": "Linear relations represent straight geometric lines possessing infinite coordinate solutions.",
    "tips": [
      "To plot a line, find at least 3 solutions to prevent plotting calculation errors."
    ],
    "pyqSample": {
      "question": "Find the value of k if x = 2, y = 1 is a solution of the equation 2x + 3y = k.",
      "marks": 1,
      "answer": "Substitute x = 2, y = 1: 2(2) + 3(1) = k => 4 + 3 = k => k = 7.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch5",
    "subjectId": "math",
    "grade": "class9",
    "number": 5,
    "title": "Lines and Angles",
    "subtopics": [
      "Intersecting & Non-Intersecting Lines",
      "Linear Pair of Angles",
      "Vertically Opposite Angles Theorem",
      "Parallel Lines and a Transversal",
      "Angle Sum Property of a Triangle"
    ],
    "keyConcepts": [
      "Linear Pair Axiom: If a ray stands on a line, the sum of adjacent angles is 180° (supplementary).",
      "Theorem: If two lines intersect, vertically opposite angles are equal.",
      "Transversal across parallel lines: Corresponding angles are equal; Alternate interior angles are equal; Consecutive interior angles sum to 180°.",
      "Theorem: The sum of three interior angles of a triangle is 180°.",
      "Exterior Angle Theorem: An exterior angle of a triangle is equal to the sum of its two interior opposite angles."
    ],
    "examWeightage": "6 to 8 Marks",
    "formulaHighlight": "Linear Pair = 180°  ·  Exterior Angle = Sum of 2 Interior Opposite Angles",
    "summary": "Axiomatic geometry establishes angle invariants across intersections, transversals, and closed triangular polygons.",
    "tips": [
      "Draw extra construction lines parallel to given reference lines when solving complex multi-transversal zig-zag angles."
    ],
    "pyqSample": {
      "question": "In △PQR, ∠P = 70° and ∠Q = 50°. Find the exterior angle ∠PRS produced by extending side QR.",
      "marks": 2,
      "answer": "Exterior angle ∠PRS = ∠P + ∠Q (Exterior Angle Theorem) = 70° + 50° = 120°.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch6",
    "subjectId": "math",
    "grade": "class9",
    "number": 6,
    "title": "Triangles",
    "subtopics": [
      "Congruence of Triangles",
      "Criteria for Congruence: SAS, ASA, AAS, SSS, RHS",
      "Properties of an Isosceles Triangle",
      "Inequalities in a Triangle"
    ],
    "keyConcepts": [
      "Two triangles are congruent if all corresponding sides and corresponding angles are equal (symbol ≅).",
      "SAS Axiom: Two sides and included angle equal.",
      "ASA Criterion: Two angles and included side equal.",
      "AAS Criterion: Two angles and non-included side equal.",
      "SSS Criterion: Three corresponding sides equal.",
      "RHS Criterion: Right angle, Hypotenuse, and one corresponding side equal.",
      "Theorem: Angles opposite to equal sides of an isosceles triangle are equal.",
      "CPCTC: Corresponding Parts of Congruent Triangles are Congruent."
    ],
    "examWeightage": "8 to 10 Marks",
    "formulaHighlight": "Congruency Criteria: SAS, ASA, AAS, SSS, RHS  ·  CPCTC",
    "summary": "Rigorous congruency proofs establish complete geometric identity between triangular structures.",
    "tips": [
      "AAA and SSA are NOT valid congruency criteria! Never cite SSA in a geometry proof."
    ],
    "pyqSample": {
      "question": "△ABC is an isosceles triangle in which AB = AC. Show that ∠B = ∠C.",
      "marks": 2,
      "answer": "Draw bisector AD of ∠A meeting BC at D. In △ABD and △ACD: AB = AC (Given), ∠BAD = ∠CAD (By construction), AD = AD (Common). By SAS congruency, △ABD ≅ △ACD. Hence by CPCTC, ∠B = ∠C. Proved.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch7",
    "subjectId": "math",
    "grade": "class9",
    "number": 7,
    "title": "Quadrilaterals",
    "subtopics": [
      "Angle Sum Property of a Quadrilateral (360°)",
      "Properties of Parallelogram",
      "Conditions for a Quadrilateral to be a Parallelogram",
      "The Mid-Point Theorem and its Converse"
    ],
    "keyConcepts": [
      "Angle sum of a quadrilateral is 360°.",
      "In a parallelogram: Opposite sides are equal; Opposite angles are equal; Diagonals bisect each other.",
      "A diagonal of a parallelogram divides it into two congruent triangles.",
      "Mid-Point Theorem: The line segment joining the mid-points of two sides of a triangle is parallel to the third side and half of it (DE ∥ BC and DE = 1/2 BC).",
      "Converse of Mid-Point Theorem: The line drawn through the mid-point of one side of a triangle parallel to another side bisects the third side."
    ],
    "examWeightage": "8 Marks",
    "formulaHighlight": "Mid-Point Theorem: DE ∥ BC and DE = ½ BC  ·  Quad Angle Sum = 360°",
    "summary": "Quadrilaterals encompass 4-sided polygonal geometry. The Mid-Point theorem links triangular proportions directly to parallelogram properties.",
    "tips": [
      "The Mid-Point theorem proof is the most frequently tested 4/5 mark question in Class 9 geometry."
    ],
    "pyqSample": {
      "question": "Show that the diagonals of a rhombus are perpendicular to each other.",
      "marks": 3,
      "answer": "Let rhombus be ABCD with diagonals intersecting at O. In △AOB and △COB: AB = BC (all sides of rhombus equal), AO = CO (diagonals of parallelogram bisect each other), BO = BO (common). By SSS congruency, △AOB ≅ △COB. Thus ∠AOB = ∠COB (CPCTC). Since they form a linear pair: ∠AOB + ∠COB = 180° => 2∠AOB = 180° => ∠AOB = 90°. Hence diagonals are perpendicular.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch8",
    "subjectId": "math",
    "grade": "class9",
    "number": 8,
    "title": "Circles",
    "subtopics": [
      "Chords and Angle Subtended at Center",
      "Perpendicular from Center to a Chord",
      "Equal Chords and Their Distances from Center",
      "Angle Subtended by an Arc of a Circle",
      "Cyclic Quadrilaterals"
    ],
    "keyConcepts": [
      "Theorem: Equal chords of a circle subtend equal angles at the center.",
      "Theorem: The perpendicular from the center of a circle to a chord bisects the chord.",
      "Theorem: The angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of the circle (∠AOB = 2∠APB).",
      "Theorem: Angles in the same segment of a circle are equal.",
      "Theorem: The angle in a semicircle is a right angle (90°).",
      "Cyclic Quadrilateral: All four vertices lie on a circle. Sum of either pair of opposite angles is 180° (∠A + ∠C = 180°)."
    ],
    "examWeightage": "8 to 10 Marks",
    "formulaHighlight": "∠Center = 2 × ∠Circumference  ·  Angle in semicircle = 90°  ·  Cyclic: ∠A + ∠C = 180°",
    "summary": "Subtended angle theorems and cyclic quad angular invariants govern circular geometry.",
    "tips": [
      "Angle subtended at center is twice angle at circumference is an essential theorem frequently proven in exams."
    ],
    "pyqSample": {
      "question": "In a cyclic quadrilateral ABCD, if ∠A = 2x + 4° and ∠C = 3x - 14°, find the value of x and the angles.",
      "marks": 3,
      "answer": "In a cyclic quadrilateral, opposite angles are supplementary: ∠A + ∠C = 180° => (2x + 4) + (3x - 14) = 180 => 5x - 10 = 180 => 5x = 190 => x = 38°. ∠A = 2(38) + 4 = 80°. ∠C = 3(38) - 14 = 100°.",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch9",
    "subjectId": "math",
    "grade": "class9",
    "number": 9,
    "title": "Heron’s Formula",
    "subtopics": [
      "Area of a Triangle by Heron’s Formula",
      "Semi-Perimeter Calculation",
      "Application in Finding Areas of Triangles & Composite Figures"
    ],
    "keyConcepts": [
      "Heron’s Formula: Area = √[ s(s - a)(s - b)(s - c) ].",
      "Semi-perimeter: s = (a + b + c) / 2, where a, b, c are the side lengths.",
      "Useful for scalene triangles where perpendicular altitude is unknown.",
      "Equilateral triangle of side a: Area = (√3 / 4) a²."
    ],
    "examWeightage": "4 to 6 Marks",
    "formulaHighlight": "Area = √[s(s - a)(s - b)(s - c)]  ·  s = (a + b + c) / 2",
    "summary": "Heron of Alexandria's formula computes triangle areas directly from three perimeter side lengths without requiring an altitude measurement.",
    "tips": [
      "Always calculate (s - a), (s - b), (s - c) separately before multiplying under the radical root."
    ],
    "pyqSample": {
      "question": "Find the area of a triangle two sides of which are 18 cm and 10 cm and the perimeter is 42 cm.",
      "marks": 3,
      "answer": "Third side c = 42 - (18 + 10) = 42 - 28 = 14 cm. Semi-perimeter s = 42 / 2 = 21 cm. (s - a) = 21 - 18 = 3 cm, (s - b) = 21 - 10 = 11 cm, (s - c) = 21 - 14 = 7 cm. Area = √[21 × 3 × 11 × 7] = √[(7 × 3) × 3 × 11 × 7] = 7 × 3 × √11 = 21√11 cm².",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch10",
    "subjectId": "math",
    "grade": "class9",
    "number": 10,
    "title": "Surface Areas and Volumes",
    "subtopics": [
      "Surface Area & Volume of a Right Circular Cone",
      "Surface Area & Volume of a Sphere",
      "Surface Area & Volume of a Hemisphere"
    ],
    "keyConcepts": [
      "Cone: Slant height l = √(r² + h²), Curved Surface Area (CSA) = πrl, Total Surface Area (TSA) = πr(l + r), Volume = (1/3)πr²h.",
      "Sphere: Surface Area = 4πr², Volume = (4/3)πr³.",
      "Hemisphere: Curved Surface Area (CSA) = 2πr², Total Surface Area (TSA) = 3πr², Volume = (2/3)πr³."
    ],
    "examWeightage": "8 to 10 Marks",
    "formulaHighlight": "Cone CSA = πrl  ·  Sphere SA = 4πr²  ·  Hemisphere TSA = 3πr²",
    "summary": "Evaluates curved spatial geometries for conical and spherical volumes and surface areas.",
    "tips": [
      "Do not confuse cone height h with slant height l. Always calculate l = √(r² + h²) first for CSA calculations."
    ],
    "pyqSample": {
      "question": "Find the total surface area of a hemisphere of radius 10 cm (use π = 3.14).",
      "marks": 2,
      "answer": "Total surface area = 3πr² = 3 × 3.14 × (10)² = 3 × 3.14 × 100 = 942 cm².",
      "year": "Class 9 Exam"
    }
  },
  {
    "id": "c9-math-ch11",
    "subjectId": "math",
    "grade": "class9",
    "number": 11,
    "title": "Statistics",
    "subtopics": [
      "Graphical Representation of Data",
      "Bar Graphs",
      "Histograms (Uniform & Varying Widths)",
      "Frequency Polygons"
    ],
    "keyConcepts": [
      "Bar Graph: Pictorial representation using rectangular bars of uniform width with equal spacing between them.",
      "Histogram: Graphical representation of continuous grouped frequency distribution with no gaps between adjacent rectangles.",
      "Area of rectangle in histogram is proportional to frequency.",
      "For classes of varying widths: Adjusted frequency = (Minimum class size / Class size of this class) × Frequency.",
      "Frequency Polygon: Formed by joining the mid-points (class marks) of the tops of the rectangles in a histogram with straight lines.",
      "Class Mark = (Upper class limit + Lower class limit) / 2."
    ],
    "examWeightage": "6 Marks",
    "formulaHighlight": "Class Mark = (Upper Limit + Lower Limit) / 2  ·  Adjusted Frequency Formula",
    "summary": "Quantitative data visualization translating grouped distributions into histograms and polygonal frequency curves.",
    "tips": [
      "Use a kink / zig-zag break on the X-axis if the scale does not start from zero."
    ],
    "pyqSample": {
      "question": "Find the class mark of the class interval 150 - 160.",
      "marks": 1,
      "answer": "Class mark = (Lower limit + Upper limit) / 2 = (150 + 160) / 2 = 310 / 2 = 155.",
      "year": "Class 9 Exam"
    }
  }
];

export const FORMULA_VAULT: FormulaItem[] = [
  {
    "id": "f1",
    "subject": "math",
    "grade": "class10",
    "chapter": "Quadratic Equations",
    "name": "Quadratic Discriminant & Formula",
    "formula": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}, \\quad D = b^2 - 4ac",
    "variables": [
      {
        "symbol": "a, b, c",
        "meaning": "Coefficients of ax² + bx + c = 0"
      },
      {
        "symbol": "D",
        "meaning": "Discriminant: determines real/equal/imaginary roots"
      }
    ],
    "note": "Real & unequal if D > 0; Real & equal if D = 0; Imaginary if D < 0."
  },
  {
    "id": "f2",
    "subject": "math",
    "grade": "class10",
    "chapter": "Arithmetic Progressions",
    "name": "AP n-th Term & Sum",
    "formula": "a_n = a + (n - 1)d, \\quad S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)",
    "variables": [
      {
        "symbol": "a",
        "meaning": "First term of AP"
      },
      {
        "symbol": "d",
        "meaning": "Common difference (a₂ - a₁)"
      },
      {
        "symbol": "n",
        "meaning": "Total number of terms"
      },
      {
        "symbol": "l",
        "meaning": "Last term (a_n)"
      }
    ]
  },
  {
    "id": "f3",
    "subject": "math",
    "grade": "class10",
    "chapter": "Trigonometry",
    "name": "Pythagorean Trigonometric Identities",
    "formula": "\\sin^2\\theta + \\cos^2\\theta = 1, \\quad 1 + \\tan^2\\theta = \\sec^2\\theta, \\quad 1 + \\cot^2\\theta = \\csc^2\\theta",
    "variables": [
      {
        "symbol": "θ",
        "meaning": "Acute angle between 0° and 90°"
      }
    ],
    "note": "Essential for LHS = RHS identity verification proofs."
  },
  {
    "id": "f4",
    "subject": "math",
    "grade": "class10",
    "chapter": "Coordinate Geometry",
    "name": "Distance & Section Formula",
    "formula": "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}, \\quad P(x, y) = \\left( \\frac{m_1x_2 + m_2x_1}{m_1 + m_2}, \\frac{m_1y_2 + m_2y_1}{m_1 + m_2} \\right)",
    "variables": [
      {
        "symbol": "x₁, y₁",
        "meaning": "Coordinates of Point A"
      },
      {
        "symbol": "x₂, y₂",
        "meaning": "Coordinates of Point B"
      },
      {
        "symbol": "m₁ : m₂",
        "meaning": "Ratio dividing the internal line segment"
      }
    ]
  },
  {
    "id": "f4b",
    "subject": "math",
    "grade": "class10",
    "chapter": "Statistics",
    "name": "Mode & Empirical Relationship",
    "formula": "3\\text{ Median} = \\text{Mode} + 2\\text{ Mean}, \\quad \\text{Mode} = l + \\left( \\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\right)h",
    "variables": [
      {
        "symbol": "l",
        "meaning": "Lower boundary limit of modal class"
      },
      {
        "symbol": "f₁",
        "meaning": "Frequency of modal class"
      },
      {
        "symbol": "f₀, f₂",
        "meaning": "Frequencies of preceding and succeeding classes"
      },
      {
        "symbol": "h",
        "meaning": "Class width interval"
      }
    ]
  },
  {
    "id": "f10",
    "subject": "math",
    "grade": "class9",
    "chapter": "Heron’s Formula",
    "name": "Heron’s Area of Triangle",
    "formula": "A = \\sqrt{s(s - a)(s - b)(s - c)}, \\quad s = \\frac{a + b + c}{2}",
    "variables": [
      {
        "symbol": "a, b, c",
        "meaning": "Lengths of the 3 sides of triangle"
      },
      {
        "symbol": "s",
        "meaning": "Semi-perimeter of triangle"
      }
    ]
  },
  {
    "id": "f11",
    "subject": "math",
    "grade": "class9",
    "chapter": "Polynomials",
    "name": "Euler Cubic Algebraic Identity",
    "formula": "x^3 + y^3 + z^3 - 3xyz = (x + y + z)(x^2 + y^2 + z^2 - xy - yz - zx)",
    "variables": [
      {
        "symbol": "x, y, z",
        "meaning": "Real numbers or polynomial terms"
      }
    ],
    "note": "If x + y + z = 0, then x³ + y³ + z³ = 3xyz."
  }
];

export const DOUBTS_FAQS: DoubtFAQ[] = [
  {
    "id": "d-math-1",
    "grade": "class10",
    "subject": "math",
    "question": "How to prove that √2 or √3 or √5 is irrational in CBSE Class 10 Board Exam?",
    "shortAnswer": "Use Proof by Contradiction: Assume p/q in lowest terms, square both sides, show that both p and q share a common factor, contradicting co-primality.",
    "deepExplanation": "1. Assume on contrary that √2 = a/b where a, b are coprime integers (HCF(a,b) = 1) and b ≠ 0.\n2. Squaring gives 2 = a²/b² => 2b² = a². Therefore 2 divides a², which implies 2 divides a.\n3. Write a = 2c for integer c. Substitute: 2b² = 4c² => b² = 2c². Thus 2 divides b² => 2 divides b.\n4. Hence both a and b share at least 2 as a common factor, contradicting that a and b are co-prime.\n5. Therefore √2 is irrational (Q.E.D.).",
    "commonMistake": "Forgetting to specify that a and b are co-prime integers."
  },
  {
    "id": "d-math-2",
    "grade": "class10",
    "subject": "math",
    "question": "What is the difference between CBSE Standard Maths (041) and Basic Maths (241)?",
    "shortAnswer": "Both share the exact same NCERT syllabus. Standard Maths tests deeper problem-solving and HOTS proofs, while Basic Maths focuses directly on core formula substitution.",
    "deepExplanation": "CBSE offers two levels for Class 10:\n1. Standard Maths (041): For students opting for Maths in Class 11 and 12 (Science PCM or Commerce with Maths).\n2. Basic Maths (241): For students not taking Maths in Senior Secondary. Both study the same 14 chapters from the identical NCERT textbook.",
    "commonMistake": "Thinking Basic Maths has fewer chapters. Both cover all 14 chapters."
  },
  {
    "id": "d-math-3",
    "grade": "class10",
    "subject": "math",
    "question": "How to easily remember Trigonometric values of standard angles (0°, 30°, 45°, 60°, 90°)?",
    "shortAnswer": "Write numbers 0, 1, 2, 3, 4, divide each by 4, and take the square root. That immediately gives sin θ: 0, 1/2, 1/√2, √3/2, 1.",
    "deepExplanation": "Take square root of (n/4) where n = 0, 1, 2, 3, 4. For cos θ, write the values in reverse order: 1, √3/2, 1/√2, 1/2, 0. For tan θ, divide sin θ by cos θ: 0, 1/√3, 1, √3, Not Defined.",
    "commonMistake": "Confusing tan 30° (1/√3) with tan 60° (√3)."
  },
  {
    "id": "d-math-4",
    "grade": "class9",
    "subject": "math",
    "question": "What is the condition for lines to be parallel in Class 9 Lines and Angles?",
    "shortAnswer": "Alternate interior angles are equal, or corresponding angles are equal, or consecutive interior angles sum to 180°.",
    "deepExplanation": "If a transversal intersects two lines such that alternate interior angles are equal, or corresponding angles are equal, or consecutive interior angles are supplementary, the lines are parallel.",
    "commonMistake": "Assuming lines are parallel without verifying an angle criterion."
  },
  {
    "id": "d-math-5",
    "grade": "class9",
    "subject": "math",
    "question": "When should we use Heron's Formula instead of 1/2 × base × height?",
    "shortAnswer": "Use Heron's formula s = (a+b+c)/2 and Area = √[s(s-a)(s-b)(s-c)] whenever side lengths a, b, c are known but the perpendicular height is unknown.",
    "deepExplanation": "Calculate semi-perimeter s = (a + b + c) / 2, then Area = √[s(s - a)(s - b)(s - c)].",
    "commonMistake": "Forgetting to divide the perimeter by 2 to get the semi-perimeter s."
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q3",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Quadratic Equations",
    "type": "mcq",
    "question": "If the quadratic equation 2x² - kx + 2 = 0 has two equal real roots, then the value of k is:",
    "options": [
      "±2",
      "±4",
      "±8",
      "4 only"
    ],
    "correctAnswer": 1,
    "explanation": "For equal roots, Discriminant D = b² - 4ac = 0. Here a = 2, b = -k, c = 2. D = (-k)² - 4(2)(2) = k² - 16 = 0 => k² = 16 => k = ±4.",
    "examTip": "Always include both plus and minus roots for quadratic constants unless stated otherwise."
  },
  {
    "id": "q10b",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Statistics",
    "type": "mcq",
    "question": "If Mode = 35.3 and Mean = 30.5, what is the Median of the frequency distribution using the empirical formula?",
    "options": [
      "32.1",
      "33.5",
      "31.2",
      "34.0"
    ],
    "correctAnswer": 0,
    "explanation": "3 Median = Mode + 2 Mean = 35.3 + 2(30.5) = 35.3 + 61.0 = 96.3. Median = 96.3 / 3 = 32.1.",
    "examTip": "Memorize: 3 Median = Mode + 2 Mean."
  },
  {
    "id": "q10d",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Introduction to Trigonometry",
    "type": "numerical",
    "question": "If sin θ + sin² θ = 1, then the value of (cos² θ + cos⁴ θ) is:",
    "options": [
      "0",
      "1",
      "2",
      "1/2"
    ],
    "correctAnswer": 1,
    "explanation": "sin θ + sin² θ = 1 => sin θ = 1 - sin² θ = cos² θ. Squaring both sides: sin² θ = cos⁴ θ. Now cos² θ + cos⁴ θ = sin θ + sin² θ = 1.",
    "examTip": "Classic CBSE board favorite identity manipulation problem."
  },
  {
    "id": "q10f",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Real Numbers",
    "type": "mcq",
    "question": "The HCF of two numbers is 27 and their LCM is 162. If one of the numbers is 54, find the other number.",
    "options": [
      "81",
      "72",
      "108",
      "54"
    ],
    "correctAnswer": 0,
    "explanation": "HCF × LCM = a × b => 27 × 162 = 54 × b => b = (27 × 162) / 54 = 162 / 2 = 81.",
    "examTip": "This formula strictly holds for two numbers, not for three numbers."
  },
  {
    "id": "q7",
    "grade": "class9",
    "subjectId": "math",
    "chapter": "Polynomials",
    "type": "mcq",
    "question": "If x + y + z = 0, then the algebraic identity x³ + y³ + z³ is identically equal to:",
    "options": [
      "0",
      "3xyz",
      "(x + y + z)³",
      "xyz"
    ],
    "correctAnswer": 1,
    "explanation": "Since x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx), substituting (x + y + z) = 0 makes the entire RHS zero, resulting in x³ + y³ + z³ = 3xyz.",
    "examTip": "Use this shortcut whenever three terms add up to zero in numerical evaluation questions."
  },
  {
    "id": "q8",
    "grade": "class9",
    "subjectId": "math",
    "chapter": "Heron’s Formula",
    "type": "numerical",
    "question": "The sides of a triangle are in the ratio 12 : 17 : 25 and its perimeter is 540 cm. Its area is:",
    "options": [
      "9000 cm²",
      "4500 cm²",
      "18000 cm²",
      "6000 cm²"
    ],
    "correctAnswer": 0,
    "explanation": "12x + 17x + 25x = 540 => 54x = 540 => x = 10. Sides are 120, 170, 250 cm. s = 540/2 = 270 cm. Area = √[270(150)(100)(20)] = √[81,000,000] = 9000 cm².",
    "examTip": "Common textbook and exemplar numerical."
  },
  {
    "id": "q9c",
    "grade": "class9",
    "subjectId": "math",
    "chapter": "Lines and Angles",
    "type": "numerical",
    "question": "An angle is equal to one-third of its supplement. The measure of the angle is:",
    "options": [
      "30°",
      "45°",
      "60°",
      "75°"
    ],
    "correctAnswer": 1,
    "explanation": "Let angle be x. Its supplement is (180° - x). x = (1/3)(180° - x) => 3x = 180° - x => 4x = 180° => x = 45°.",
    "examTip": "Supplementary angles sum to 180°; Complementary angles sum to 90°."
  },
  {
    "id": "q10m",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Triangles",
    "type": "mcq",
    "question": "In triangle ABC, DE || BC such that AD/DB = 3/5. If AC = 5.6 cm, then AE equals:",
    "options": [
      "2.1 cm",
      "3.5 cm",
      "1.8 cm",
      "2.8 cm"
    ],
    "correctAnswer": 0,
    "explanation": "By Thales / Basic Proportionality Theorem, AD/AB = AE/AC. Since AD/DB = 3/5, AD/AB = 3/(3+5) = 3/8. AE = (3/8) × AC = (3/8) × 5.6 = 3 × 0.7 = 2.1 cm.",
    "examTip": "Always check whether DB or full AB is required when setting up the Thales ratio."
  },
  {
    "id": "q10n",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Coordinate Geometry",
    "type": "numerical",
    "question": "Find the coordinates of the point P which divides the line segment joining A(1, -2) and B(4, 7) internally in the ratio 1 : 2.",
    "options": [
      "(2, 1)",
      "(2, 3)",
      "(3, 2)",
      "(1, 1)"
    ],
    "correctAnswer": 0,
    "explanation": "By Section Formula: x = (m1·x2 + m2·x1)/(m1+m2) = (1·4 + 2·1)/(1+2) = 6/3 = 2. y = (m1·y2 + m2·y1)/(m1+m2) = (1·7 + 2·(-2))/(1+2) = (7 - 4)/3 = 3/3 = 1. P is (2, 1).",
    "examTip": "Section Formula: P = ((m1 x2 + m2 x1)/(m1+m2), (m1 y2 + m2 y1)/(m1+m2))."
  },
  {
    "id": "q10o",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Circles",
    "type": "mcq",
    "question": "From an external point P, tangents PA and PB are drawn to a circle with centre O. If angle APB = 80°, what is the measure of angle AOB?",
    "options": [
      "80°",
      "100°",
      "90°",
      "120°"
    ],
    "correctAnswer": 1,
    "explanation": "Radius is perpendicular to the tangent at the point of contact (OAP = OBP = 90°). In quadrilateral OAPB, the sum of interior angles is 360°. Hence angle AOB + angle APB = 180° (supplementary). angle AOB = 180° - 80° = 100°.",
    "examTip": "Angle subtended at center and angle between external tangents are ALWAYS supplementary (add to 180°)."
  },
  {
    "id": "q10p",
    "grade": "class10",
    "subjectId": "math",
    "chapter": "Probability",
    "type": "mcq",
    "question": "What is the probability that a randomly chosen non-leap year contains 53 Sundays?",
    "options": [
      "1/7",
      "2/7",
      "53/365",
      "52/365"
    ],
    "correctAnswer": 0,
    "explanation": "A non-leap year has 365 days = 52 weeks + 1 extra day. The 52 complete weeks guarantee 52 Sundays. The remaining 1 day can be any of the 7 days of the week. Probability of it being Sunday is 1/7. (For a leap year with 2 extra days, it is 2/7).",
    "examTip": "Classic CBSE trap: Non-leap year = 1/7; Leap year = 2/7."
  },
  {
    "id": "q9j",
    "grade": "class9",
    "subjectId": "math",
    "chapter": "Number Systems",
    "type": "mcq",
    "question": "Rationalizing the denominator of 1 / (√7 - √6) yields:",
    "options": [
      "√7 - √6",
      "√7 + √6",
      "1 / (√7 + √6)",
      "7 - 6"
    ],
    "correctAnswer": 1,
    "explanation": "Multiply numerator and denominator by conjugate (√7 + √6): [1 × (√7 + √6)] / [(√7 - √6)(√7 + √6)] = (√7 + √6) / (7 - 6) = √7 + √6.",
    "examTip": "Standard algebraic trick: (a - b)(a + b) = a² - b²."
  },
  {
    "id": "q9k",
    "grade": "class9",
    "subjectId": "math",
    "chapter": "Quadrilaterals",
    "type": "mcq",
    "question": "The line segment joining the mid-points of two sides of a triangle is parallel to the third side and is equal to:",
    "options": [
      "One-third of the third side",
      "Half of the third side",
      "Twice the third side",
      "Equal to the third side"
    ],
    "correctAnswer": 1,
    "explanation": "By the Mid-Point Theorem: In triangle ABC, if D and E are mid-points of AB and AC respectively, then DE || BC and DE = (1/2) BC.",
    "examTip": "One of the most frequently proven theorems in Class 9 geometry."
  },
  {
    "id": "q9l",
    "grade": "class9",
    "subjectId": "math",
    "chapter": "Linear Equations in Two Variables",
    "type": "numerical",
    "question": "If the point (3, 4) lies on the graph of the equation 3y = ax + 7, then the value of a is:",
    "options": [
      "5/3",
      "3/5",
      "1",
      "2"
    ],
    "correctAnswer": 0,
    "explanation": "Substitute x = 3 and y = 4 into 3y = ax + 7: 3(4) = a(3) + 7 => 12 = 3a + 7 => 3a = 5 => a = 5/3.",
    "examTip": "Any point (x, y) lying on a linear graph satisfies the equation when substituted."
  }
];
