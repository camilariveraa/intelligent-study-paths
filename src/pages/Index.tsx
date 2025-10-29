import { Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import Logo from "@/components/Logo";
import SearchInput from "@/components/SearchInput";
import FeatureCard from "@/components/FeatureCard";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="bg-blur-orb w-[600px] h-[600px] bg-malva top-0 left-0" />
      <div className="bg-blur-orb w-[500px] h-[500px] bg-cielo top-1/4 right-0" />
      <div className="bg-blur-orb w-[400px] h-[400px] bg-lavanda bottom-0 left-1/3" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
              Cómo funciona
            </a>
          </div>
          <Button className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
            Comenzar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Rutas de aprendizaje personalizadas con IA</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Aprende cualquier tema<br />con una{" "}
              <span className="text-gradient">ruta perfecta</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Next usa IA para investigar, seleccionar los mejores videos de YouTube y crear 
              rutas de aprendizaje personalizadas que se adaptan a tu progreso
            </p>

            <div className="pt-8">
              <SearchInput />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Aprende de manera inteligente
            </h2>
            <p className="text-xl text-muted-foreground">
              Una experiencia de aprendizaje diseñada para tu éxito
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Rutas Personalizadas"
              description="La IA analiza tu objetivo y crea una ruta de aprendizaje perfecta con los mejores videos de YouTube curados específicamente para ti"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Evaluación Continua"
              description="Preguntas contextuales y ejercicios prácticos para evaluar tu comprensión en tiempo real y asegurar que dominas cada concepto"
            />
            <FeatureCard
              icon={Zap}
              title="Recomendaciones Micro-específicas"
              description="Si identificamos una debilidad específica, te recomendamos contenido ultra-enfocado en ese tema exacto, no categorías genéricas"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tan simple como 1, 2, 3
            </h2>
            <p className="text-xl text-muted-foreground">
              Tu camino al aprendizaje efectivo en tres pasos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number={1}
              title="Dinos qué quieres aprender"
              description="Escribe cualquier tema que te interese y nuestra IA comenzará a trabajar en tu ruta personalizada"
            />
            <StepCard
              number={2}
              title="Aprende y practica"
              description="Sigue tu ruta con videos curados, responde preguntas y completa ejercicios para reforzar tu conocimiento"
            />
            <StepCard
              number={3}
              title="Domina el tema"
              description="Recibe recomendaciones específicas para tus áreas de mejora y alcanza el dominio completo del tema"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-2xl rounded-3xl" />
            <div className="relative bg-card border border-primary/30 rounded-3xl p-12 text-center space-y-6 glow-hover">
              <h2 className="text-3xl md:text-4xl font-bold">
                Comienza a aprender hoy
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Miles de personas ya están aprendiendo con Next. 
                Únete y descubre una nueva forma de dominar cualquier tema.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-primary text-primary-foreground font-bold px-8 py-6 text-lg hover:opacity-90 transition-opacity"
              >
                Crear mi primera ruta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo />
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Next. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
