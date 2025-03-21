package generation

type Generator struct {
}

func NewGenerator() *Generator {
	return &Generator{}
}

func (g *Generator) Generate() string {
	return template
}

func (g *Generator) GeneratePost(params map[string]interface{}) string {
	return template
}
